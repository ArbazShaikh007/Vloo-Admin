import React from "react";
import "./Loader.css";

// const WaterBubbleLoader = () => {
//   const getRandomInt = (min, max) =>
//     Math.floor(Math.random() * (max - min + 1)) + min;

//   // Create water bubbles with random properties
//   const waterBubbles = Array.from({ length: 150 }, (_, index) => {
//     const randomLeft = getRandomInt(0, 100);
//     const randomDuration = getRandomInt(3, 8); // Random duration between 3s and 8s
//     const randomDelay = getRandomInt(0, 3); // Random delay between 0s and 3s
//     const randomSize = getRandomInt(8, 40); // Random bubble size

//     return (
//       <div
//         className="water-bubble"
//         style={{
//           left: `${randomLeft}%`,
//           animationDuration: `${randomDuration}s`,
//           animationDelay: `${randomDelay}s`,
//           width: `${randomSize}px`,
//           height: `${randomSize}px`,
//         }}
//         key={index}
//       />
//     );
//   });

//   return (
//     <div className="water-loader-container">
//       <div className="water-overlay"></div>
//       {waterBubbles}
//     </div>
//   );
// };

// export default WaterBubbleLoader;
// ?
// export default function VlooLoader() {
//   return (
//     <div className="loader">
//       {/* Gradients */}
//       <svg height="0" width="0" viewBox="0 0 100 100" className="absolute">
//         <defs>
//           <linearGradient
//             id="b"
//             x1="0"
//             y1="62"
//             x2="0"
//             y2="2"
//             gradientUnits="userSpaceOnUse"
//           >
//             <stop stopColor="#0369a1" />
//             <stop stopColor="#67e8f9" offset="1.5" />
//           </linearGradient>
//           <linearGradient
//             id="c"
//             x1="0"
//             y1="64"
//             x2="0"
//             y2="0"
//             gradientUnits="userSpaceOnUse"
//           >
//             <stop stopColor="#0369a1" />
//             <stop stopColor="#22d3ee" offset="1" />
//             <animateTransform
//               attributeName="gradientTransform"
//               type="rotate"
//               values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
//               dur="8s"
//               repeatCount="indefinite"
//               keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
//               keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
//             />
//           </linearGradient>
//           <linearGradient
//             id="d"
//             x1="0"
//             y1="62"
//             x2="0"
//             y2="2"
//             gradientUnits="userSpaceOnUse"
//           >
//             <stop stopColor="#38bdf8" />
//             <stop stopColor="#075985" offset="1.5" />
//           </linearGradient>
//         </defs>
//       </svg>

//       {/* V */}
//       <svg
//         viewBox="0 0 100 100"
//         width="100"
//         height="100"
//         className="inline-block"
//       >
//         <path
//           strokeWidth="8"
//           stroke="url(#b)"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="dash"
//           pathLength="360"
//           d="M 20,20 L 50,80 L 80,20"
//         />
//       </svg>

//       {/* L */}
//       <svg
//         viewBox="0 0 100 100"
//         width="100"
//         height="100"
//         className="inline-block"
//       >
//         <path
//           strokeWidth="8"
//           stroke="url(#d)"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="dash"
//           pathLength="360"
//           d="M 20,20 L 20,80 L 80,80"
//         />
//       </svg>

//       {/* First O */}
//       <svg
//         viewBox="0 0 100 100"
//         width="100"
//         height="100"
//         className="inline-block"
//       >
//         <path
//           strokeWidth="11"
//           stroke="url(#c)"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="spin"
//           pathLength="360"
//           d="M 50,15
//              A 35,35 0 0 1 85,50
//              A 35,35 0 0 1 50,85
//              A 35,35 0 0 1 15,50
//              A 35,35 0 0 1 50,15 Z"
//         />
//       </svg>

//       {/* Second O */}
//       <svg
//         viewBox="0 0 100 100"
//         width="100"
//         height="100"
//         className="inline-block"
//       >
//         <path
//           strokeWidth="11"
//           stroke="url(#c)"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="spin"
//           pathLength="360"
//           d="M 50,15
//              A 35,35 0 0 1 85,50
//              A 35,35 0 0 1 50,85
//              A 35,35 0 0 1 15,50
//              A 35,35 0 0 1 50,15 Z"
//         />
//       </svg>
//     </div>
//   );
// }
// ?
// export default function VlooLoader() {
//   return (
//     <div className="loader">
//       {/* Gradients */}
//       <svg height="0" width="0" viewBox="0 0 100 100" className="absolute">
//         <defs>
//           {/* Gradient 1 - Light green to white */}
//           <linearGradient
//             id="b"
//             x1="0"
//             y1="62"
//             x2="0"
//             y2="2"
//             gradientUnits="userSpaceOnUse"
//           >
//             <stop stopColor="rgb(128, 215, 210)" />
//             <stop stopColor="#ffffff" offset="1.5" />
//           </linearGradient>

//           {/* Gradient 2 - Dark green to white (spinning one) */}
//           <linearGradient
//             id="c"
//             x1="0"
//             y1="64"
//             x2="0"
//             y2="0"
//             gradientUnits="userSpaceOnUse"
//           >
//             <stop stopColor="#004d61" />
//             <stop stopColor="#ffffff" offset="1" />
//             <animateTransform
//               attributeName="gradientTransform"
//               type="rotate"
//               values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
//               dur="8s"
//               repeatCount="indefinite"
//               keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
//               keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
//             />
//           </linearGradient>

//           {/* Gradient 3 - Light green to dark green */}
//           <linearGradient
//             id="d"
//             x1="0"
//             y1="62"
//             x2="0"
//             y2="2"
//             gradientUnits="userSpaceOnUse"
//           >
//             <stop stopColor="rgb(128, 215, 210)" />
//             <stop stopColor="#004d61" offset="1.5" />
//           </linearGradient>
//         </defs>
//       </svg>

//       {/* V */}
//       <svg
//         viewBox="0 0 100 100"
//         width="100"
//         height="100"
//         className="inline-block"
//       >
//         <path
//           strokeWidth="8"
//           stroke="url(#b)"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="dash"
//           pathLength="360"
//           d="M 20,20 L 50,80 L 80,20"
//         />
//       </svg>

//       {/* L */}
//       <svg
//         viewBox="0 0 100 100"
//         width="100"
//         height="100"
//         className="inline-block"
//       >
//         <path
//           strokeWidth="8"
//           stroke="url(#d)"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="dash"
//           pathLength="360"
//           d="M 20,20 L 20,80 L 80,80"
//         />
//       </svg>

//       {/* First O */}
//       <svg
//         viewBox="0 0 100 100"
//         width="100"
//         height="100"
//         className="inline-block"
//       >
//         <path
//           strokeWidth="11"
//           stroke="url(#c)"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="spin"
//           pathLength="360"
//           d="M 50,15
//              A 35,35 0 0 1 85,50
//              A 35,35 0 0 1 50,85
//              A 35,35 0 0 1 15,50
//              A 35,35 0 0 1 50,15 Z"
//         />
//       </svg>

//       {/* Second O */}
//       <svg
//         viewBox="0 0 100 100"
//         width="100"
//         height="100"
//         className="inline-block"
//       >
//         <path
//           strokeWidth="11"
//           stroke="url(#c)"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="spin"
//           pathLength="360"
//           d="M 50,15
//              A 35,35 0 0 1 85,50
//              A 35,35 0 0 1 50,85
//              A 35,35 0 0 1 15,50
//              A 35,35 0 0 1 50,15 Z"
//         />
//       </svg>
//     </div>
//   );
// }

export default function LogoAnimation() {
  return (
    <svg
      width="300"
      height="150"
      viewBox="0 0 209 102"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo"
    >
      <g className="draw">
        <path d="M44.0431 48.0309L21.9325 101.616L0 48.0309H17.4463L22.075 63.8394L27.202 48.0309H44.0431Z" />
        <path d="M58.3562 34.3585V78.1524C58.3562 80.5023 58.7478 82.0689 59.4955 82.8522C60.2432 83.6356 64.765 84.0272 67.0082 84.0272H67.7914V98.732H63.7681C58.285 98.732 53.9768 97.1298 50.9148 93.9253C47.8528 90.7209 46.3218 86.2703 46.3218 80.5735V34.3585V25.5286H160.898V34.3585H58.3562Z" />
        <path d="M96.8804 46.749C104.073 46.749 110.232 49.3482 115.359 54.5821C120.486 59.816 123.05 66.0468 123.05 73.3458C123.05 80.7516 120.451 87.0536 115.288 92.2163C110.125 97.379 103.823 99.9782 96.4175 99.9782C89.0473 99.9782 82.7809 97.379 77.5826 92.1807C72.3843 86.9824 69.7852 80.716 69.7852 73.3458C69.7852 65.9044 72.4199 59.638 77.6538 54.4753C82.8877 49.3126 89.2966 46.749 96.8804 46.749ZM96.4175 61.6674C93.3199 61.6674 90.6852 62.8068 88.5133 65.0855C86.3414 67.3642 85.2376 70.1058 85.2376 73.3458C85.2376 76.5502 86.3414 79.3274 88.5133 81.6061C90.7208 83.8848 93.3199 85.0242 96.4175 85.0242C99.5507 85.0242 102.185 83.8848 104.357 81.6417C106.529 79.363 107.597 76.6214 107.597 73.3814C107.597 70.1414 106.529 67.3998 104.357 65.1211C102.185 62.8068 99.5507 61.6674 96.4175 61.6674Z" />
        <path d="M154.168 46.749C161.361 46.749 167.52 49.3482 172.647 54.5821C177.774 59.816 180.338 66.0468 180.338 73.3458C180.338 80.7516 177.739 87.0536 172.576 92.2163C167.413 97.379 161.111 99.9782 153.706 99.9782C146.335 99.9782 140.069 97.379 134.871 92.1807C129.672 86.9824 127.073 80.716 127.073 73.3458C127.073 65.9044 129.708 59.638 134.942 54.4753C140.211 49.3126 146.585 46.749 154.168 46.749ZM153.741 61.6674C150.644 61.6674 148.009 62.8068 145.837 65.0855C143.665 67.3642 142.561 70.1058 142.561 73.3458C142.561 76.5502 143.665 79.3274 145.837 81.6061C148.044 83.8848 150.644 85.0242 153.741 85.0242C156.874 85.0242 159.509 83.8848 161.681 81.6417C163.853 79.363 164.921 76.6214 164.921 73.3814C164.921 70.1414 163.853 67.3998 161.681 65.1211C159.509 62.8068 156.839 61.6674 153.741 61.6674Z" />
        <path d="M209 7.83305L203.161 9.43526V0H209V7.83305Z" />
        <path d="M182.368 23.3568H165.527C165.527 23.3568 167.556 10.9663 157.124 6.80055V6.19528L166.809 0.0356445H200.954V9.50652C188.278 13.4586 182.581 19.7963 182.581 19.7963L182.368 23.3568Z" />
        <path d="M185.501 19.6538C185.501 19.6538 192.444 14.1351 200.953 11.6783C200.953 11.6783 200.953 28.4126 207.149 37.2426C207.149 37.2426 207.006 37.8122 206.116 37.741C206.116 37.741 195.826 24.0332 195.684 20.0099L185.501 19.6538Z" />
        <path d="M183.899 25.7423H164.138V34.0382H183.899V25.7423Z" />
      </g>
    </svg>
  );
}
