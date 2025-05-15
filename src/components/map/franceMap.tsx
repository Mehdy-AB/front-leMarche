"use client";

import Departments from "@/lib/map/Departments";
import Regions from "@/lib/map/Regions";
import { useEffect, useRef, useState } from "react";


export default function FranceMap({selectedDepartments,setSelectedDepartments}:{setSelectedDepartments:(id:number,name:string)=>void,selectedDepartments:{id:number,name:string}[]}) {
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [animatedViewBox, setAnimatedViewBox] = useState("0 0 1000 860");
  const [targetViewBox, setTargetViewBox] = useState("0 0 1000 860");

  const animationRef = useRef<number | null>(null);

  const regionDepartments: Record<number, number[]> = {
    1 : [1, 3, 7, 15, 26, 38, 42, 43, 63, 69, 73, 74],
    2 : [2, 59, 60, 62, 80],
    3 : [4, 5, 6, 13, 83, 84],
    4 : [8, 10, 51, 52, 54, 55, 57, 67, 68, 88],
    5 : [9, 11, 12, 30, 31, 32, 34, 46, 48, 65, 66, 81, 82],
    6 : [14, 27, 50, 61, 76],
    7 : [16, 17, 19, 23, 24, 33, 40, 47, 64, 79, 86, 87],
    8 : [18, 28, 36, 37, 41, 45],
    9 : [21, 25, 39, 58, 70, 71, 89, 90],
    10: [22, 29, 35, 56],
    11: [211, 222],
    12: [44, 49, 53, 72, 85],
    13: [75, 77, 78, 91, 92, 93, 94, 95],
  };

  // Animation effect
  useEffect(() => {
    if (animatedViewBox === targetViewBox) return;

    const [x0, y0, w0, h0] = animatedViewBox.split(" ").map(Number);
    const [x1, y1, w1, h1] = targetViewBox.split(" ").map(Number);

    const steps = 30;
    let currentStep = 0;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const animate = () => {
      currentStep++;
      const t = currentStep / steps;
      const ease = (t: number) => t * (2 - t); // easeOutQuad

      const lerp = (a: number, b: number) => a + (b - a) * ease(t);

      const x = lerp(x0, x1);
      const y = lerp(y0, y1);
      const w = lerp(w0, w1);
      const h = lerp(h0, h1);

      setAnimatedViewBox(`${x} ${y} ${w} ${h}`);

      if (currentStep < steps) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [targetViewBox]);

  return (
    <div className="w-full border relative p-4 rounded-lg shadow-lg h-full">
      
      {selectedRegion ? (
        <><div onClick={() => {setSelectedRegion(null);}} className="z-10 absolute top-1 left-1 rounded-full p-1 bg-white shadow-md border hover:bg-gray-200 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div><Departments
            initialViewBox={animatedViewBox}
            allowedDepartments={regionDepartments[selectedRegion] || []}
            selected={selectedDepartments}
            setSlected={setSelectedDepartments} /></>
      ) : (
        <Regions
          onRegionClick={(id) => {
            const regionPath = document.getElementById(`departement-${id}`);
            if (regionPath instanceof SVGPathElement) {
              const bbox = regionPath.getBBox();

              // Keep zoom size fixed, center region
              const zoomWidth = 400;
              const zoomHeight = 344;
              const centerX = bbox.x + bbox.width / 2;
              const centerY = bbox.y + bbox.height / 2;
              const minX = centerX - zoomWidth / 2;
              const minY = centerY - zoomHeight / 2;

              const viewBox = `${minX} ${minY} ${zoomWidth} ${zoomHeight}`;
              setTargetViewBox(viewBox);
              setSelectedRegion(id);
            }
          }}
        />
      )}
    </div>
  );
}
