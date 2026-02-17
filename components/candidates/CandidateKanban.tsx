"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CandidateStatus } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  currentPosition: string | null;
  status: CandidateStatus;
  assignedUser: {
    id: string;
    name: string;
    email: string;
  } | null;
  updatedAt: string;
}

interface CandidateKanbanProps {
  initialCandidates: Record<CandidateStatus, Candidate[]>;
}

const statusBadgeClass: Record<string, string> = {
  APPLIED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  SCREENING: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  INTERVIEW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  OFFER: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  HIRED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const STATUS_ORDER: CandidateStatus[] = [
  CandidateStatus.APPLIED,
  CandidateStatus.SCREENING,
  CandidateStatus.INTERVIEW,
  CandidateStatus.OFFER,
  CandidateStatus.HIRED,
  CandidateStatus.REJECTED,
];

// Define valid status transitions (forward-only workflow) - matches API validation
const VALID_TRANSITIONS: Record<CandidateStatus, CandidateStatus[]> = {
  [CandidateStatus.APPLIED]: [CandidateStatus.SCREENING, CandidateStatus.REJECTED],
  [CandidateStatus.SCREENING]: [CandidateStatus.INTERVIEW, CandidateStatus.REJECTED],
  [CandidateStatus.INTERVIEW]: [CandidateStatus.OFFER, CandidateStatus.REJECTED],
  [CandidateStatus.OFFER]: [CandidateStatus.HIRED, CandidateStatus.REJECTED],
  [CandidateStatus.HIRED]: [], // Terminal state
  [CandidateStatus.REJECTED]: [], // Terminal state
};

function isValidTransition(from: CandidateStatus, to: CandidateStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

function DroppableColumn({
  id,
  children,
}: {
  id: CandidateStatus;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      status: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] ${isOver ? "ring-2 ring-primary ring-offset-2 rounded-lg bg-primary/5" : ""}`}
    >
      {children}
    </div>
  );
}

function SortableCandidateCard({
  candidate,
  onStatusChange,
}: {
  candidate: Candidate;
  onStatusChange: (candidateId: string, newStatus: CandidateStatus) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className="rounded-2xl shadow-xl cursor-grab active:cursor-grabbing hover:shadow-2xl transition-shadow mb-3"
        {...attributes}
        {...listeners}
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="font-semibold">{candidate.name}</div>
            {candidate.currentPosition && (
              <div className="text-sm text-muted-foreground">
                {candidate.currentPosition}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{candidate.assignedUser?.name ?? "Unassigned"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(candidate.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CandidateKanban({ initialCandidates }: CandidateKanbanProps) {
  const router = useRouter();
  const [candidates, setCandidates] = useState(initialCandidates);
  const [updating, setUpdating] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const candidateId = active.id as string;
    let newStatus: CandidateStatus | null = null;

    // First, check if dropped directly on a column (droppable)
    const overId = over.id as string;
    if (Object.values(CandidateStatus).includes(overId as CandidateStatus)) {
      newStatus = overId as CandidateStatus;
    } else {
      // If dropped on a card or within a column, find which column it belongs to
      // Check if it's a candidate card ID
      for (const status of STATUS_ORDER) {
        if (candidates[status]?.some((c) => c.id === overId)) {
          newStatus = status;
          break;
        }
      }
      
      // If still not found, check parent droppable data (this handles drops on empty columns)
      if (!newStatus && over.data?.current) {
        const droppableData = over.data.current;
        // Check if it's a column type drop
        if (droppableData.type === "column" && droppableData.status) {
          newStatus = droppableData.status as CandidateStatus;
        }
      }
    }

    if (!newStatus) {
      console.error("Could not determine drop target:", over.id, over.data);
      return;
    }

    // Find candidate and current status
    let currentStatus: CandidateStatus | null = null;
    for (const status of STATUS_ORDER) {
      if (candidates[status]?.some((c) => c.id === candidateId)) {
        currentStatus = status;
        break;
      }
    }

    if (!currentStatus || currentStatus === newStatus) return;

    // Validate transition before attempting
    if (!isValidTransition(currentStatus, newStatus)) {
      alert(
        `Invalid status transition from ${currentStatus} to ${newStatus}. ` +
        `Valid transitions: ${VALID_TRANSITIONS[currentStatus].join(", ") || "none (terminal state)"}`
      );
      return;
    }

    // Optimistic update
    const candidate = candidates[currentStatus]?.find((c) => c.id === candidateId);
    if (!candidate) {
      console.error("Candidate not found in current status");
      return;
    }

    setUpdating((prev) => new Set(prev).add(candidateId));

    // Update local state optimistically
    setCandidates((prev) => {
      const newCandidates = { ...prev };
      // Remove from current status
      newCandidates[currentStatus!] = newCandidates[currentStatus!].filter(
        (c) => c.id !== candidateId
      );
      // Add to new status (ensure array exists)
      if (!newCandidates[newStatus]) {
        newCandidates[newStatus] = [];
      }
      newCandidates[newStatus] = [
        ...newCandidates[newStatus],
        { ...candidate, status: newStatus },
      ];
      return newCandidates;
    });

    try {
      const response = await fetch(`/api/candidates/${candidateId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update status");
      }

      // Refresh page to get latest data
      router.refresh();
    } catch (error) {
      console.error("Error updating candidate status:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update status";
      console.error("Error details:", errorMessage);
      // Revert optimistic update
      setCandidates((prev) => {
        const newCandidates = { ...prev };
        // Remove from new status
        if (newCandidates[newStatus]) {
          newCandidates[newStatus] = newCandidates[newStatus].filter(
            (c) => c.id !== candidateId
          );
        }
        // Add back to current status (ensure array exists)
        if (!newCandidates[currentStatus!]) {
          newCandidates[currentStatus!] = [];
        }
        newCandidates[currentStatus!] = [
          ...newCandidates[currentStatus!],
          candidate,
        ];
        return newCandidates;
      });
      alert("Failed to update candidate status. Please try again.");
    } finally {
      setUpdating((prev) => {
        const next = new Set(prev);
        next.delete(candidateId);
        return next;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={() => {
        // Optional: Add visual feedback when drag starts
      }}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_ORDER.map((status) => {
          const statusCandidates = candidates[status] || [];
          return (
            <DroppableColumn key={status} id={status}>
              <div className="flex-shrink-0 w-80 bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{status}</h3>
                  <Badge
                    className={`${statusBadgeClass[status] ?? statusBadgeClass.APPLIED}`}
                  >
                    {statusCandidates.length}
                  </Badge>
                </div>
                <SortableContext
                  items={statusCandidates.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 min-h-[100px]">
                    {statusCandidates.map((candidate) => (
                      <SortableCandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onStatusChange={(id, newStatus) => {
                          // Handled by drag end
                        }}
                      />
                    ))}
                    {statusCandidates.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        Drop candidates here
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            </DroppableColumn>
          );
        })}
      </div>
    </DndContext>
  );
}
