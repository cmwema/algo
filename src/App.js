import { useState } from "react";
import "./App.css";

function App() {
  const [open, setOpen] = useState([]);
  const [closed, setClosed] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [targetNode, setTargetNode] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);

  function handleClick(event) {
    const cellId = event.target.id;

    if (!startNode) {
      setStartNode(cellId);
      event.target.style.backgroundColor = "red";
    } else if (!targetNode) {
      setTargetNode(cellId);
      event.target.style.backgroundColor = "green";
    }
  }
  // generte the grid
  function generateGrid(r, c) {
    function cell(row, cols) {
      let cells = [];
      for (let col = 0; col < cols; col++) {
        cells.push(
          <td
            key={col}
            id={`${row},${col}`}
            onClick={handleClick}
            style={{
              border: "1px solid black",
              backgroundColor: "white",
              width: "20px",
              height: "20px",
            }}
          ></td>
        );
      }
      return cells;
    }
    let rows = [];

    for (let row = 0; row < r; row++) {
      rows.push(<tr key={row}>{cell(row, c)}</tr>);
    }
    return rows;
  }

  // manhhattan distance h(n)
  function calculateDistance(currentNode, targetNode) {
    const [x1, y1] = currentNode.split(",");
    const [x2, y2] = targetNode.split(",");

    return Math.hypot(x2 - x1, y2 - y1);
  }

  function getNeighbors(node) {
    const [x, y] = node.split(",");
    const neighbors = [
      `${+x},${+y + 1}`, //top
      `${+x + 1},${+y + 1}`, // top -right
      `${+x + 1},${+y}`, // right
      `${+x + 1},${+y - 1}`, // bottom -right
      `${+x},${+y - 1}`, //bottom
      `${+x - 1},${+y - 1}`, //bottom left
      `${+x - 1},${+y}`, // left
      `${+x - 1},${+y + 1}`, // top left
    ];
    return neighbors.filter((n) => !closed.includes(n));
  }

  // A* algorithm
  function Astaralgo(node) {
    if (node === targetNode) {
      document.getElementById(targetNode).style.backgroundColor = "teal";
      setCurrentNode(null);
      setStartNode(null);
      setTargetNode(null);
      return;
    }

    setClosed([...closed, node]);
    const index = open.findIndex((item) => item.id === node);
    setOpen([...open.slice(0, index), ...open.slice(index + 1)]);
    document.getElementById(node).style.backgroundColor = "teal";

    const neighbors = getNeighbors(node);
    let minNode = null;
    let minFCost = Infinity;
    let minHCost = Infinity;

    for (let n of neighbors) {
      const gcost = calculateDistance(startNode, n);
      const hcost = calculateDistance(n, targetNode);
      const fcost = hcost + gcost;
      if (fcost < minFCost) {
        minFCost = fcost;
        minNode = n;
      }
      if (fcost === minFCost) {
        if (hcost < minHCost) {
          minHCost = hcost;
          minNode = n;
        }
      }
      open.push({ id: n, fcost, hcost });
    }

    setCurrentNode(minNode);
    console.log(closed);
    console.log(open);
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <table id="grid" style={{ borderCollapse: "collapse" }}>
        <tbody>{generateGrid(20, 30)}</tbody>
      </table>
      <div>
        {startNode && targetNode && !currentNode && (
          <button onClick={() => Astaralgo(startNode)}>Start A*</button>
        )}
        {currentNode && (
          <button onClick={() => Astaralgo(currentNode)}>Next</button>
        )}
      </div>
    </div>
  );
}

export default App;
