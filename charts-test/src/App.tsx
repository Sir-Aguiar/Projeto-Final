import axios from "axios";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

/* export const data = [
	["Professor", "aulas"],
	["Felipe Ferreira Aguiar", 1],
	["Stephani Larmor", 7],
]; */

export const options = {
	title: "Aulas na Turma 11",
};

const App: React.FC = () => {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		axios
			.get("http://localhost:8080/aulas-professor-turma?idTurma=10", {
				headers: {
					Authorization:
						"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlbGlwZWZlcnJlaXJhYWd1aWFyOUBnbWFpbC5jb20iLCJpZFVzdWFyaW8iOjExLCJpYXQiOjE2OTUyMTIwODF9.Fq3o-8fksUynwFZmRGhzHV7BlwkQavAXemcUOrGyFhQ",
				},
			})
			.then((res) => {
				const obj = [];
				for (const stat of res.data.stats) {
					obj.push([stat[0].nome, stat[1]]);
				}

				console.log([["Professor", "aulas"], ...obj]);
				setData([["Professor", "aulas"], ...obj, ["sasaDASd", 0]]);
			});
	}, []);

	return (
		<div className="app">
			{data.length > 1 && <Chart chartType="PieChart" data={data} options={options} width={"100%"} height={"400px"} />}
		</div>
	);
};

export default App;

