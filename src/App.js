import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import GlobalContextProvider from "./GlobalContext.jsx";
import Login from "./Page/Login/index.jsx";
import Home from "./Page/Home/index.jsx";
import Dashboard from "./Page/Home/Deshboard/index.jsx";
import Userlist from "./Page/Home/Userlist/index.jsx";
import Grouplist from "./Page/Home/ServiceProvider/index.jsx";
import Privacypolicys from "./Page/Home/Privacy/index.jsx";
import TermsConditions from "./Page/Home/Trems/index.jsx";
import {
  ChangepasswordModel,
  ForgotPasswordModel,
  LogoutModel,
  OtpVerifyModel,
  UpdatepasswordModel,
} from "./Common/Model/index.jsx";
import Profile from "./Page/Home/Profile/index.jsx";
import Zone from "./Page/Home/Zone/Zone.jsx";
import Services from "./Page/Home/Services/Services.jsx";
import Faqs from "./Page/Home/Faqs/Faqs.jsx";
import {
  AddproviderModel,
  DeleteproviderModel,
  EditproviderModel,
} from "./components/Models/ProviderModels/index.jsx";
import {
  AddServiceModel,
  DeleteServiceModel,
  EditServiceModel,
} from "./components/Models/ServicesModels/index.jsx";
import AddZone from "./Page/Home/AddZone/AddZone.jsx";
import AddSubZone from "./Page/Home/AddZone/AddSubZone.jsx";
import { DeleteZoneModel } from "./components/Models/ZoneModels/index.jsx";
import DeleteSubZoneModel from "./components/Models/ZoneModels/index_two.jsx";
import Banner from "./Page/Home/Banner/Banner.jsx";
import {
  AddBannerModel,
  DeleteBannerModel,
  EditBannerModel,
} from "./components/Models/BannerModels/index.jsx";
import Brand from "./Page/Home/Brand/Brand.jsx";
import {
  AddBrandModel,
  DeleteBrandModel,
  EditBrandModel,
} from "./components/Models/BrandModels/index.jsx";
import CarModal from "./Page/Home/CarModal/CarModal.jsx";
import {
  AddCarmodalModel,
  DeleteCarmodalModel,
  EditCarmodalModel,
} from "./components/Models/CarmodalModels/index.jsx";
import Assign from "./Page/Home/Assign/Assign.jsx";
import {
  AssignservicesModel,
  DeleteAssignServicesModel,
  EditAssignservicesModel,
} from "./components/Models/AssignModels/index.jsx";
import StoreTime from "./Page/Home/StoreTime/StoreTime.jsx";
import { UpdateStoretimeModel } from "./components/Models/StoreTimeModels/index.jsx";
import {
  AddFaqsModel,
  DeleteFaqsModel,
  EditFaqsModel,
} from "./components/Models/FaqsModel/index.jsx";
import Extras from "./Page/Home/Extras/Extras.jsx";
import {
  AddExtrasModel,
  DeleteExtraModel,
  EditExtraModel,
} from "./components/Models/ExtrasModels/index.jsx";
import Contactus from "./Page/Home/Contactus/Contactus.jsx";
import {
  DeleteSupportModel,
  SupportReplyModel,
} from "./components/Models/SupportModels/index.jsx";
import Aboutus from "./Page/Home/Aboutus/index.jsx";
import PrivacyPolicy from "./components/Cms-privew/PrivacyPolicy/PrivacyPolicy.jsx";
import Reports from "./Page/Home/Reports/Reports.jsx";
import SubZone from "./Page/Home/Zone/SubZone";

function App() {
  return (
    <div className="App">
      <GlobalContextProvider>
        <ForgotPasswordModel />
        <ChangepasswordModel />
        <LogoutModel />
        <OtpVerifyModel />
        <UpdatepasswordModel />

        {/* Provider Model*/}
        <AddproviderModel />
        <EditproviderModel />
        <DeleteproviderModel />
        {/* ? */}

        {/*Service Model */}
        <AddServiceModel />
        <EditServiceModel />
        <DeleteServiceModel />
        {/* ? */}

        {/* zone Model */}
        <DeleteZoneModel />
        <DeleteSubZoneModel />
        {/*Banner Model  */}
        <AddBannerModel />
        <EditBannerModel />
        <DeleteBannerModel />
        {/* brand Model */}
        <AddBrandModel />
        <EditBrandModel />
        <DeleteBrandModel />
        {/* car model */}
        <AddCarmodalModel />
        <EditCarmodalModel />
        <DeleteCarmodalModel />

        {/* Assigned models */}
        <AssignservicesModel />
        <EditAssignservicesModel />
        <DeleteAssignServicesModel />

        {/* stor time */}
        <UpdateStoretimeModel />

        {/* / faqs */}
        <AddFaqsModel />
        <EditFaqsModel />
        <DeleteFaqsModel />

        {/* extras models */}
        <AddExtrasModel />
        <EditExtraModel />
        <DeleteExtraModel />

        {/* support Models */}
        <SupportReplyModel />
        <DeleteSupportModel />
        <Routes>
          <Route path="/" element={<Navigate replace to="/Login" />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
          <Route path="/Home" element={<Home />}>
            <Route
              path="/Home/"
              element={<Navigate replace to="/Home/Dashboard" />}
            />
            <Route path="/Home/Dashboard" element={<Dashboard />} />
            <Route path="/Home/Userlist" element={<Userlist />} />
            <Route path="/Home/ServiceProvider" element={<Grouplist />} />
            <Route path="/Home/Trems&Condition" element={<TermsConditions />} />
            <Route path="/Home/PrivacyPolicy" element={<Privacypolicys />} />
            <Route path="/Home/Profile" element={<Profile />} />
            <Route path="/Home/Zone" element={<Zone />} />
            <Route path="/Home/SubZones/:zoneId" element={<SubZone />} />
            <Route path="/Home/AddZone" element={<AddZone />} />
           <Route path="/Home/SubZones/create" element={<AddSubZone />} />
            <Route path="/Home/AllServices" element={<Services />} />
            <Route path="/Home/Faqs" element={<Faqs />} />
            <Route path="/Home/Banner" element={<Banner />} />
            <Route path="/Home/Brand" element={<Brand />} />
            <Route path="/Home/CarModal" element={<CarModal />} />
            <Route path="/Home/Assign" element={<Assign />} />
            <Route path="/Home/StoreTime" element={<StoreTime />} />
            <Route path="/Home/Extras" element={<Extras />} />
            <Route path="/Home/Contact-us" element={<Contactus />} />
            <Route path="/Home/About-us" element={<Aboutus />} />
            <Route path="/Home/Reports" element={<Reports />} />
          </Route>
        </Routes>
      </GlobalContextProvider>
    </div>
  );
}

export default App;
