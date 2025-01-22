import PomodoroTimer from "@/components/fragments/pomodoroTimer";
import Navbar from "@/components/ui/navbar";
import React from "react";

export default function FocusModePage() {
  return (
    <div>
      <Navbar></Navbar>
      <PomodoroTimer></PomodoroTimer>
    </div>
  );
}
