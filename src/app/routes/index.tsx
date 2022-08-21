import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashborad } from "../pages";
import { useDrawerContext } from "../shared/contexts";

export const AppRoutes = () => {

	const { setDrawerOptions } = useDrawerContext();

	useEffect(() => {
		setDrawerOptions([
			{
				icon: "home",
				path: "/pagina-inicial",
				label: "HOME",
			},
			{
				icon: "star",
				path: "/cidades",
				label: "CIDADES"
			}
		]);
	}, []);

	return(

		<Routes>
			<Route 
				path="/pagina-inicial" 
				element= { 
					<Dashborad /> 
				}
			/>

			<Route path="*" element={<Navigate to="/pagina-inicial" />} />
		</Routes>

	);

};