import { BrowserRouter } from "react-router-dom";

import "./shared/forms/TraducoesYup";

import { AppThemeProvider, AuthProvider, DrawerProvider } from "./shared/contexts";
import { MenuLateral } from "./shared/components";
import { AppRoutes } from "./routes";

export const App = () => {

	return (
		<AuthProvider>
			<AppThemeProvider>
				<DrawerProvider>
					<BrowserRouter>

						<MenuLateral>				
							<AppRoutes />
						</MenuLateral>
						
					</BrowserRouter>
				</DrawerProvider>
			</AppThemeProvider>
		</AuthProvider>
	);

};