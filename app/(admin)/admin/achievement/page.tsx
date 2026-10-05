"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trophy } from "lucide-react";
import { IAchievement } from "@/types/achievement";
import { useAchievementActions } from "@/hooks/useAchievementActions";
import AchievementFormModal from "../_components/achievement/AchievementFormModal";
import AchievementCard from "../_components/achievement/AchievementCard";
import { Card } from "@/components/ui/card";

export default function AdminAchievementPage() {
  const [achievements, setAchievements] = useState<IAchievement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<IAchievement | null>(null);

  const { getAchievements, deleteAchievement, isLoading, isDeleting } =
    useAchievementActions();

  const fetchAchievements = async () => {
    const data = await getAchievements();
    setAchievements(data || []);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleOpenCreate = () => {
    setEditingAchievement(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: IAchievement) => {
    setEditingAchievement(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAchievement(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      const ok = await deleteAchievement(id);
      if (ok) {
        fetchAchievements();
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-amber-500" />
            Achievements Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Showcase hackathons, awards, certifications, and milestones
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Achievement
        </Button>
      </div>

      <AchievementFormModal
        isOpen={modalOpen}
        achievement={editingAchievement}
        onClose={handleCloseModal}
        onSuccess={fetchAchievements}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading achievements...
          </span>
        </div>
      ) : achievements.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No achievements added yet. Click &quot;Add Achievement&quot; to showcase your milestones!
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {achievements.map((item) => (
            <AchievementCard
              key={item._id}
              achievement={item}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting === item._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
