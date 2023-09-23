import axios from "axios";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

const getMonthlyPresence = async () => {
  const response = await axios.get("http://192.168.15.20:8080/students-stat?idAluno=1759", {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlbGlwZWZlcnJlaXJhYWd1aWFyOUBnbWFpbC5jb20iLCJpZFVzdWFyaW8iOjExLCJpYXQiOjE2OTQ4NzY5NDh9.IhDe9RBsLeL6uu9Wh6HhcwdKoUtB9Hmpa8jeiqeRG4I",
    },
  });
  return response.data.data;
};

export const options = {
  title: "Aulas na Turma 11",
};

const App: React.FC = () => {
  const [ChartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    getMonthlyPresence().then((res: any) => {
      setChartData([["Mês", "Faltas"], ...res]);
    });
  }, []);
  return (
    <div className="app">
      <div className="sidebar"></div>
      <div className="main_content">
        <div className="chart_container">
          {ChartData.length > 1 && <Chart chartType="Line" width="100%" height="100%" data={ChartData} />}
        </div>
        <div className="infographs"></div>
      </div>
      <div className="another_sidebar"></div>
    </div>
  );
};

export default App;
