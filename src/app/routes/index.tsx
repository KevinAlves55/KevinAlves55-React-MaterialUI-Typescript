import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";

import { 
	Dashborad, 
	ListagemDeCidade 
} from "../pages";

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
				icon: "location_city",
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

			<Route 
				path="/cidades" 
				element= { 
					<ListagemDeCidade /> 
				}
			/>

			<Route path="*" element={<Navigate to="/pagina-inicial" />} />
		</Routes>

	);

};