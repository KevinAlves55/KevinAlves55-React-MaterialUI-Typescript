import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";

import { 
	Dashborad, 
	ListagemDePessoas 
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
				icon: "people",
				path: "/pessoas",
				label: "PESSOAS"
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
				path="/pessoas" 
				element= { 
					<ListagemDePessoas /> 
				}
			/>

			<Route 
				path="/pessoas/detalhe/:id"
				element={
					<p>Detalhe</p>
				}
			/>

			<Route path="*" element={<Navigate to="/pagina-inicial" />} />
		</Routes>

	);

};