"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ExperienceForm from './ExperienceForm';

export default function ExperienceCreateButton() {
  const [open, setOpen] = useState(false);
  
  const handleSuccess = () => {
    setOpen(false);
  };
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Add Experience
      </Button>
      
      <ExperienceForm
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}