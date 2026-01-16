import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/Header.jsx";
import SignIn from "./screens/SignIn.jsx";
import LoginUser from "./screens/LoginUser.jsx";
import SignInUsuario from "./screens/SignInUsuario.jsx";
import SignInEmpresa from "./screens/SignInEmpresa.jsx";
import AtracoesAdd from "./screens/prefeitura/atracoes/AtracoesAdd.jsx";
import AtracoesPanel from "./screens/prefeitura/atracoes/AtracoesPanel.jsx";
import Guides from "./screens/Guides.jsx";
import ImportarGuia from "./screens/prefeitura/guias/ImportarGuia.jsx";
import LandingPage from "./screens/LandingPage.jsx";

import Filtrados from "./screens/Filtrados.jsx";
import AtracaoDetalhes from "./screens/AtracaoDetalhes.jsx";
import ConfirmAtracao from "./screens/ConfirmAtracao.jsx";
import Login from "./screens/Login.jsx";
import PasseiosPanel from "./screens/guia/passeios/passeiosPanel.jsx";
import PasseioAdd from "./screens/guia/passeios/PasseioAdd.jsx";
import PerfilUser from "./screens/usuario/Perfil.jsx";
import MeusRoteiros from "./screens/usuario/Roteiros.jsx";
import Landing from "./layouts/Landing.jsx";
import Default from "./layouts/Default.jsx";
import Details from "./layouts/DetailsAtracao.jsx";
import Agenda from "./screens/guia/Agenda.jsx";
import Fixed from "./layouts/Fixed.jsx";
import AdminLayout from "./layouts/Admin.jsx";
import AtracoesEdit from "./screens/prefeitura/atracoes/AtracoesEdit.jsx";
import ExploreDetails from "./screens/ExploreDetails.jsx";
import AddCategoria from "./screens/prefeitura/categorias/AddCategoria.jsx";
import PanelGuias from "./screens/prefeitura/guias/PanelGuias.jsx";
import Dashboard from "./screens/prefeitura/Dashboard.jsx";
import RoteirosPanel from "./screens/prefeitura/roteiros/RoteirosPanel.jsx";
import CategoriasPanel from "./screens/prefeitura/categorias/CategoriasPanel.jsx";
import EditCategoria from "./screens/prefeitura/categorias/EditCategoria.jsx";
import FixedGuias from "./layouts/FixedGuias.jsx";
import ConfirmGuide from "./screens/ConfirmGuide.jsx";
import PerfilGuia from "./screens/guia/Perfil.jsx";
import AdminGuia from "./layouts/AdminGuia.jsx";
import Roteiros from "./screens/usuario/Roteiros.jsx";
import EmConstrucao from "./screens/EmConstrucao.jsx";
import NaoEncontrado from "./screens/NaoEncontrado.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Visualizacoes from "./screens/guia/Visualizacoes.jsx";
import Planos from "./screens/Planos.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import AddAttractionsGuide from "./screens/guia/AddAttractionsGuide.jsx";
import AttractionsPanelGuide from "./screens/guia/AttractionsPanelGuide.jsx";
import SendMail from "./screens/prefeitura/newsletter/SendMail.jsx";
import PagamentosGuia from "./screens/guia/Pagamentos.jsx";
import PaymentSuccess from "./screens/PaymentSuccess.jsx";
import Passeios from "./screens/usuario/Passeios.jsx";
import Events from "./screens/Events.jsx";
import FixedEvents from "./layouts/FixedEvents.jsx";
import EventsPanel from "./screens/prefeitura/eventos/EventsPanel.jsx";
import EventsAdd from "./screens/prefeitura/eventos/AddEvent.jsx";
import AddCategoryEvent from "./screens/prefeitura/categorias/AddCategoryEvent.jsx";
import PublicEventAdd from "./screens/usuario/PublicEventAdd.jsx";
import EventsEdit from "./screens/prefeitura/eventos/EventsEdit.jsx";
import DefinePassword from "./screens/DefinePassword.jsx";
import PasseioEdit from "./screens/guia/passeios/PasseioEdit.jsx";
import EventDetail from "./screens/EventDetail.jsx";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: "0.9rem" },
        }}
      />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            path="/landing-page"
            element={
              <Landing>
                <LandingPage />
              </Landing>
            }
          />
          <Route
            path="/filtrados"
            element={
              <Fixed>
                <Filtrados />
              </Fixed>
            }
          />
          <Route
            path="/"
            element={
              <Landing>
                <LandingPage />
              </Landing>
            }
          />
          <Route
            path="/atracoes/confirm/:token"
            element={
              <Default>
                <ConfirmAtracao />
              </Default>
            }
          />
          <Route
            path="/pagamento/sucesso"
            element={
              <Default>
                <PaymentSuccess />
              </Default>
            }
          />
          <Route
            path="/guide/confirm/:token"
            element={
              <Default>
                <ConfirmGuide />
              </Default>
            }
          />
          <Route
            path="/definir-senha"
            element={
              <Default>
                <DefinePassword />
              </Default>
            }
          />
          <Route
            path="meus-roteiros"
            element={
              <Default>
                <Roteiros />
              </Default>
            }
          />
          <Route
            path="meus-passeios"
            element={
              <Default>
                <Passeios />
              </Default>
            }
          />
          <Route
            path="eventos"
            element={
              <FixedEvents>
                <Events />
              </FixedEvents>
            }
          />
          <Route
            path="/login-user"
            element={
              <Default>
                <LoginUser />
              </Default>
            }
          />

          <Route
            path="/esqueci-minha-senha"
            element={
              <Default>
                <ForgotPassword />
              </Default>
            }
          />
          <Route
            path="/login"
            element={
              <Default>
                <LoginUser />
              </Default>
            }
          />
          <Route
            path="/blog/:category"
            element={
              <Default>
                <ExploreDetails />
              </Default>
            }
          />
          <Route
            path="/perfil/user"
            element={
              <Default>
                <PerfilUser />
              </Default>
            }
          />
          <Route
            path="/guias"
            element={
              <FixedGuias>
                <Guides />
              </FixedGuias>
            }
          />
          <Route
            path="/atracao/:id"
            element={
              <Details>
                <AtracaoDetalhes />
              </Details>
            }
          />
          <Route
            path="/sign-in"
            element={
              <Default>
                <SignIn />
              </Default>
            }
          />

          <Route
            path="/cadastro/usuario"
            element={
              <Default>
                <SignInUsuario />
              </Default>
            }
          />

          {/* <Route
            path="/guia/perfil"
            element={
              <Default>
                <PerfilGuia />
              </Default>
            }
          /> */}

          {/* <Route
            path="/guia/passeios"
            element={
              <Default>
                <PasseiosPanel />
              </Default>
            }
          /> */}

          <Route element={<AdminGuia />}>
            <Route path="/guia/perfil" element={<PerfilGuia />} />
            <Route path="/guia/panel/passeios" element={<PasseiosPanel />} />
            <Route path="/guia/pagamentos" element={<PagamentosGuia />} />
            <Route path="/guia/add-passeio" element={<PasseioAdd />} />
            <Route path="/guia/edit-passeio/:id" element={<PasseioEdit />} />
            <Route path="/guia/atracao" element={<AttractionsPanelGuide />} />
            <Route path="/guia/add-atracao" element={<AddAttractionsGuide />} />
            <Route path="/guia/visualizacoes" element={<Visualizacoes />} />
            <Route path="/guia/panel/agenda" element={<Agenda />} />
          </Route>

          <Route
            path="/cadastro/empresa"
            element={
              <Default>
                <SignInEmpresa />
              </Default>
            }
          />

           <Route
            path="/evento/:id"
            element={
              <Default>
                <EventDetail />
              </Default>
            }
          />

            <Route
            path="/cadastrar-evento"
            element={
              <Default>
                <PublicEventAdd />
              </Default>
            }
          />

          <Route element={<AdminLayout />}>
            <Route path="/admin/atracoes" element={<AtracoesPanel />} />
            <Route path="/admin/send-mail" element={<SendMail />} />
            <Route path="/admin/add-atracao" element={<AtracoesAdd />} />
            <Route path="/admin/add-evento" element={<EventsAdd />} />
            <Route path="/admin/roteiros" element={<RoteirosPanel />} />
            <Route path="/admin/eventos" element={<EventsPanel />} />
            <Route path="/admin/edit-atracao/:id" element={<AtracoesEdit />} />
            <Route path="/admin/edit-evento/:id" element={<EventsEdit />} />
            <Route path="/admin/add-categoria" element={<AddCategoria />} />
            <Route path="/admin/add-categoria-evento" element={<AddCategoryEvent />} />
            <Route path="/admin/importar-guia" element={<ImportarGuia />} />
            <Route path="/admin/guias" element={<PanelGuias />} />
            <Route path="/admin/categorias" element={<CategoriasPanel />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route
              path="/admin/edit-categoria/:id"
              element={<EditCategoria />}
            />
          </Route>

          <Route
            path="/planos"
            element={
              <Default>
                <Planos />
              </Default>
            }
          />

          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </Router>
    </>
  );
}
