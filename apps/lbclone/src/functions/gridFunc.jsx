const DrawOutline = ({canvas: canvasRef, color: c, lineWidth: lw}) => {
    const canvas = canvasRef.current;
    if(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = c || '#000000';
        ctx.lineWidth = lw || 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
    return;
}

const ClearCanvas = ({canvas: canvasRef, bg = null}) => {
    const canvas = canvasRef.current;
    if(canvas) {
        const ctx = canvas.getContext('2d');
        if(bg) {
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        else{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    return;
}

const ConnectPoints = (canvasRef, {x: x1, y: y1}, {x: x2, y: y2}, {c: color, w: width, ld: linedash}) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color || '#000000';
    ctx.lineWidth = width || 1;
    ctx.setLineDash(linedash || []); // Dashed lines
    ctx.stroke();
}

const DrawCircle = ({canvas: canvasRef, x, y, r, outline, fill, outlinecolor, outlineThickness, fillcolor, strokeStyle}) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);


            // Draw outline if outline is true
    if (outline) {
        if (strokeStyle) {
            ctx.setLineDash(strokeStyle);
        }

        ctx.strokeStyle = outlinecolor || '#000000';  // Set stroke color
        ctx.lineWidth = outlineThickness || 1;           // Ensure line width is set

        ctx.stroke();
        ctx.setLineDash([]); // Reset dash pattern
    }


    // Fill the circle if fill is true
    if (fill) {
        ctx.fillStyle = fillcolor || '#000000';  // Use fillcolor, not outlinecolor
        ctx.fill();
    }

};

export { DrawOutline, ClearCanvas, ConnectPoints, DrawCircle };