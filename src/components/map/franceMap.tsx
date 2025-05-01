// "use client";

// import Regions from "@/lib/map/Regions";
// import { useState } from "react";

// export default function Map() {
//   const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

//   const regionDepartments: Record<string, string[]> = {
//     FRARA: ["FR01", "FR03", "FR07", "FR15", "FR26", "FR38", "FR42", "FR43", "FR63", "FR69", "FR73", "FR74"],
//     FRBFC: ["FR21", "FR25", "FR39", "FR58", "FR70", "FR71", "FR89", "FR90"],
//     FRBRE: ["FR22", "FR29", "FR35", "FR56"],
//     FRCVL: ["FR18", "FR28", "FR36", "FR37", "FR41", "FR45"],
//     FRGES: ["FR08", "FR10", "FR51", "FR52", "FR54", "FR55", "FR57", "FR67", "FR68", "FR88"],
//     FRHDF: ["FR02", "FR59", "FR60", "FR62", "FR80"],
//     FRIDF: ["FR75", "FR77", "FR78", "FR91", "FR92", "FR93", "FR94", "FR95"],
//     FRNAQ: ["FR16", "FR17", "FR19", "FR23", "FR24", "FR33", "FR40", "FR47", "FR64", "FR79", "FR86", "FR87"],
//     FRNOR: ["FR14", "FR27", "FR50", "FR61", "FR76"],
//     FROCC: ["FR09", "FR11", "FR12", "FR30", "FR31", "FR32", "FR34", "FR46", "FR48", "FR65", "FR66", "FR81", "FR82"],
//     FRPAC: ["FR04", "FR05", "FR06", "FR13", "FR83", "FR84"],
//     FRPDL: ["FR44", "FR49", "FR53", "FR72", "FR85"],
//     FR20R: ["FR2A", "FR2B"],
//   };

//   return (
//     <div className="relative w-full h-screen overflow-hidden bg-blue-50">
//       {selectedRegion ? (
//         <Departments
//           allowedDepartments={regionDepartments[selectedRegion] || []}
//           onDepartmentClick={(id) => console.log("Clicked department", id)}
//         />
//       ) : (
//         <Regions
//           onRegionClick={(id) => {
//             setSelectedRegion(id);
//           }}
//         />
//       )}
//     </div>
//   );
// }
