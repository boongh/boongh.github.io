import { useState, useEffect, useLayoutEffect, useRef} from 'react';
import { DrawCircle, ConnectPoints, DrawOutline, ClearCanvas } from '../functions/gridFunc.jsx';
import { cn } from '../cn.jsx';
import ConfigData from './Data.jsx';

const Grid = ({charSetArr, charSequenceArr, confirmedcharSeqArr}) => {
    if(charSetArr.length !== 12){
        console.error("Invalid character sets")
        return;
    }
    const [hasPainted, setHasPainted] = useState(false);
    const [GridAttribute, setGridAttribute] = useState(null);

    
    useLayoutEffect(() => {
        // This runs after DOM updates but before the browser paints.
        // It triggers a re-render.
        setHasPainted(true);
    }, []); // Empty dependency array ensures it runs only once.

    // Create array of refs for the 12 letter positions
    const letterRefs = useRef([]);
    
    let refGrid = useRef();
    let canvasRef = useRef();
    
    const letterPositions = [2, 3, 4, 10, 15, 20, 24, 23, 22, 16, 11, 6];

    useEffect(() => {
        ConfigData().then(data => {
        setGridAttribute(data.GridAttribute)}
    )}, []);

    let rowPositions;
    let dotPositions;

    function ConnectDots(lineParams, dotParams, dotsArray){
        if (dotsArray.length < 2) return;
        let lastDot = null;

        dotsArray.forEach((dot, index) => {
            if (lastDot !== null){
                let lastDotPos = dotPositions[lastDot];
                let dotPos = dotPositions[dot];
                DrawCircle({canvas: canvasRef, ...lastDotPos, ...dotParams});
                ConnectPoints(canvasRef, lastDotPos, dotPos, lineParams);
                DrawCircle({canvas: canvasRef, ...dotPos, ...dotParams});
            }   
            lastDot = dot;
        })
        return;
    }

    const DrawGrid = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        DrawOutline({canvas: canvasRef, color: GridAttribute.outlineColor, lineWidth: GridAttribute.outlineWidth});
        Object.values(dotPositions).forEach((dot) => {
            DrawCircle({
                canvas: canvasRef,
                x: dot.x,
                y: dot.y,
                r: GridAttribute.dotRadius,
                outline: GridAttribute.dotOutlineWidth > 0,
                fill: GridAttribute.dotFillColor !== null,
                outlinecolor: GridAttribute.dotOutlineColor,
                fillcolor: GridAttribute.dotFillColor,
                strokeStyle: GridAttribute.dotDash,
                outlineThickness: GridAttribute.dotOutlineWidth
            });
        })
    }

    useEffect(() => {
        const handleResize = () => {
            
        };
  
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Check if all required refs are available before proceeding
        if (!canvasRef.current || letterRefs.current.length < 3 || !letterRefs.current[0] || !letterRefs.current[1] || !letterRefs.current[2]) {
            return;
        }
        
        if (canvasRef.current) {
            canvasRef.current.width = GridAttribute.width;
            canvasRef.current.height =  GridAttribute.height;
        }
        
        ClearCanvas({canvas: canvasRef, bg : GridAttribute.fillColor})

        rowPositions = [
            0, 
            letterRefs.current[0].getBoundingClientRect().x - canvasRef.current.getBoundingClientRect().x + letterRefs.current[0].getBoundingClientRect().width / 2, 
            letterRefs.current[1].getBoundingClientRect().x - canvasRef.current.getBoundingClientRect().x + letterRefs.current[1].getBoundingClientRect().width / 2, // Fixed: removed double comma
            letterRefs.current[2].getBoundingClientRect().x - canvasRef.current.getBoundingClientRect().x + letterRefs.current[2].getBoundingClientRect().width / 2, // Fixed: removed double comma
            GridAttribute.width
        ];

        dotPositions = [
            {
                x: rowPositions[1], y: rowPositions[0]
            },
            {
                x: rowPositions[2], y: rowPositions[0]
            },
            {
                x: rowPositions[3], y: rowPositions[0]
            },
            {
                x: rowPositions[4], y: rowPositions[1]
            },
            {
                x: rowPositions[4], y: rowPositions[2]
            },
            {
                x: rowPositions[4], y: rowPositions[3]
            },
            {
                x: rowPositions[3], y: rowPositions[4]
            },
            {
                x: rowPositions[2], y: rowPositions[4]
            },
            {
                x: rowPositions[1], y: rowPositions[4]
            },
            {
                x: rowPositions[0], y: rowPositions[3]
            },
            {
                x: rowPositions[0], y: rowPositions[2]
            },
            {
                x: rowPositions[0], y: rowPositions[1]
            },
        ]

        DrawGrid();

        let connection = charSequenceArr.map((char, index) => {
            return charSetArr.indexOf(char)
        });

        ConnectDots({
            c: GridAttribute.lineColor,
            w: GridAttribute.lineWidth,
            ld: GridAttribute.lineDash
        }, {
            outline: GridAttribute.connectedDotOutlineWidth > 0,
            fill: GridAttribute.connectedDotFillColor !== null,
            outlinecolor: GridAttribute.connectedDotOutlineColor,
            fillColor: GridAttribute.connectedDotFillColor,
            outlineThickness: GridAttribute.connectedDotOutlineWidth,
            strokeStyle: GridAttribute.dotDash,
            r: GridAttribute.connectedDotRadius
        }, connection);

        let confirmedConnection = confirmedcharSeqArr.map((char, index) => {
            return charSetArr.indexOf(char)
        });
        ConnectDots({
            c: GridAttribute.confirmedLineColor,
            w: GridAttribute.confirmedLineWidth,
            ld: GridAttribute.confirmedLineDash
        }, {
            outline: GridAttribute.connectedDotOutlineWidth > 0,
            fill: GridAttribute.connectedDotFillColor !== null,
            outlinecolor: GridAttribute.connectedDotOutlineColor,
            fillColor: GridAttribute.connectedDotFillColor,
            outlineThickness: GridAttribute.connectedDotOutlineWidth,
            strokeStyle: GridAttribute.dotDash,
            r: GridAttribute.connectedDotRadius
        }, confirmedConnection);
        console.log("Confirmed: ", confirmedConnection)

        console.log("Grid repainted")
    }, [GridAttribute, hasPainted, charSequenceArr])

    if (!GridAttribute) {
        return <div>Loading...</div>;
    }
    
    return (
            <div className='relative w-[350px] h-[350px]'>
                <canvas ref = {(el) => canvasRef.current = el}
                    className={cn('p-0 absolute top-[55px] left-[55px] w-[240px] h-[240px] bg-transparent'
                    )}/>
                <div className="relative w-[350px] h-[350px] grid grid-cols-5" ref = {(el) => refGrid.current = el}>
                    {[...Array(25)].map((_, index) => {
                        const position = index + 1;
                        const isLetterPosition = letterPositions.includes(position);
                        // Calculate the ref index based on the position in letterPositions array
                        const currentRefIndex = isLetterPosition ? letterPositions.indexOf(position) : null;
                        const highlightformat = cn("text-black text-2xl font-bold text-center flex items-center justify-center", {
                            "text-white" : charSequenceArr.includes(charSetArr[currentRefIndex]),}
                        )

                        //if(isLetterPosition){
                        //    console.log(`${charSequenceArr.includes(charSetArr[currentRefIndex]) ? "Highlight" : "Don't highlight"}  ${charSetArr[currentRefIndex]}`)
                        //};

                        return (
                            <p 
                                key={index}
                                className={highlightformat}
                                ref={isLetterPosition ? (el) => letterRefs.current[currentRefIndex] = el : null}
                            >
                                {isLetterPosition ? `${charSetArr[currentRefIndex]}` : ""}
                            </p>
                        );
                    })}
                </div>
            </div>
        );
    
};

export default Grid;