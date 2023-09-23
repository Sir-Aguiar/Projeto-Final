import axios from "axios";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
export const data = [
  ["Mês", "Faltas", { role: "style" }],
  ["Janeiro", 0, "red"],
  ["Fevereiro", 0, "blue"],
  ["Março", 0, "green"],
  ["Abril", 0, "black"],
  ["Maio", 0, "yellow"],
  ["Junho", 0, "red"],
  ["Julho", 0, "red"],
  ["Agosto", 0, "red"],
  ["Setembro", 1, "red"],
];

export const options = {
  title: "Aulas na Turma 11",
};

const App: React.FC = () => {
  return (
    <div className="app">
      <div className="cointainer">
        <Chart chartType="ColumnChart" width="100%" height="400px" data={data} />
      </div>
    </div>
  );
};

export default App;
