// import React from 'react'

// function Heatmap() {

//     const data = [
//         {date: "26-05-1", count: 2},
//         {date: "26-05-2", count: 0},
//         {date: "26-05-3", count: 4},
//         {date: "26-05-4", count: 8},
//         {date: "26-05-5", count: 0},
//         {date: "26-05-6", count: 2},
//         {date: "26-05-7", count: 1},
//         {date: "26-05-8", count: 5},
//         {date: "26-05-9", count: 2},
//         {date: "26-05-10", count: 1},
//         {date: "26-05-11", count: 2},
//         {date: "26-05-12", count: 2},,
//         {date: "26-05-13", count: 1},
//         {date: "26-05-14", count: 2},
//     ]

//     const days = [1, 2, 3, 4, 5,6 ,7, 8, 9, 10, 11, 12, 13, 14, 15];
//     const shade = "bg-red-400"

//   return (
//     <div className='flex'>
//       {data.map((day, id) => {
//         if (day?.count > 0) {
//             shade = "bg-"
//         }
//         return ( 
//             <div key={id} className={`h-8 w-20 text-sm rounded ${shade} border border-black flex items-center justify-center`}>{day?.date}</div>
//         )
//       })}
//     </div>
//   )
// }

// export default Heatmap
