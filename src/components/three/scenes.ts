"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ModelKind } from "@/lib/content";
import type { SceneProps } from "./LazyScene";

// Each scene is a separate chunk (three.js + drei load only when the first scene nears the viewport).
export const HeroMoleculeScene = dynamic(() => import("./HeroMolecule"), { ssr: false }) as ComponentType<SceneProps>;
export const AboutGlassScene = dynamic(() => import("./AboutGlass"), { ssr: false }) as ComponentType<SceneProps>;
export const ExpertiseViewerScene = dynamic(() => import("./ExpertiseViewer"), { ssr: false }) as ComponentType<
  SceneProps & { model: ModelKind }
>;
