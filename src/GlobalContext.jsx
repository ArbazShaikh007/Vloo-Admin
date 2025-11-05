import { children, createContext, useState } from "react";
export const GlobalContext = createContext(global);

const GlobalContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [editorPPData, setEditorPPData] = useState("");
  const [profiledata, setprofileData] = useState();
  const [editorTCData, setEditorTCData] = useState("");
  const [forgotPasswordModel, setForgotPasswordModel] = useState(false);
  const [changePasswordshow, setchangePasswordshow] = useState(false);
  const [LogoutModalshow, setLogoutModalshow] = useState(false);

  // ✅ subadmin: hydrate from localStorage so refresh keeps the value
  const [is_subadmin, setIsSubadmin] = useState(() => {
    const saved = localStorage.getItem("Login Response");
    if (!saved) return false;
    try {
      const parsed = JSON.parse(saved);
      const v = parsed?.is_subadmin;
      return (
        v === true ||
        v === 1 ||
        v === "1" ||
        v === "true" ||
        v === "True" ||
        v === "TRUE"
      );
    } catch (e) {
      return false;
    }
  });

  // ? otp verify model
  const [OtpverifyModel, setOtpverifyModel] = useState(false);
  const [mailOTP, setmailOTP] = useState("");
  const [UpadatePasswordmodel, setUpadatePasswordmodel] = useState(false);

  // ? Provider models
  const [Addprovidermodel, setAddprovidermodel] = useState(false);
  const [Editprovidermodel, setEditprovidermodel] = useState(false);
  const [Deleteprovidermodel, setDeleteprovidermodel] = useState(false);
  const [Selectedprovider, setSelectedprovider] = useState("");
  const [reloadProviderList, setreloadProviderList] = useState(false);

  // ? Service models
  const [AddServicemodel, setAddServicemodel] = useState(false);
  const [EditServicemodel, setEditServicemodel] = useState(false);
  const [DeleteServicemodel, setDeleteServicemodel] = useState(false);
  const [SelectedService, setSelectedService] = useState("");
  const [reloadServiceList, setreloadServiceList] = useState(false);

  // ? Zone models
  const [DeleteZonemodel, setDeleteZonemodel] = useState(false);
  const [DeleteSubZonemodel, setDeleteSubZonemodel] = useState(false);
  const [SelectedZone, setSelectedZone] = useState("");
  const [reloadZoneList, setreloadZoneList] = useState(false);

  // ? Banner models
  const [AddBannermodel, setAddBannermodel] = useState(false);
  const [EditBannermodel, setEditBannermodel] = useState(false);
  const [DeleteBannermodel, setDeleteBannermodel] = useState(false);
  const [SelectedBanner, setSelectedBanner] = useState("");
  const [reloadBannerList, setreloadBannerList] = useState(false);

  // ? Brand models
  const [AddBrandmodel, setAddBrandmodel] = useState(false);
  const [EditBrandmodel, setEditBrandmodel] = useState(false);
  const [DeleteBrandmodel, setDeleteBrandmodel] = useState(false);
  const [SelectedBrand, setSelectedBrand] = useState("");
  const [reloadBrandList, setreloadBrandList] = useState(false);

  // ? CarModel models
  const [AddCarModelmodel, setAddCarModelmodel] = useState(false);
  const [EditCarModelmodel, setEditCarModelmodel] = useState(false);
  const [DeleteCarModelmodel, setDeleteCarModelmodel] = useState(false);
  const [SelectedCarModel, setSelectedCarModel] = useState("");
  const [reloadCarModelList, setreloadCarModelList] = useState(false);

  // ? Assigned models
  const [AddAssignedmodel, setAddAssignedmodel] = useState(false);
  const [EditAssignedmodel, setEditAssignedmodel] = useState(false);
  const [DeleteAssignedmodel, setDeleteAssignedmodel] = useState(false);
  const [SelectedAssigned, setSelectedAssigned] = useState("");
  const [reloadAssignedList, setreloadAssignedList] = useState(false);

  // ? Store time
  const [editStoreTimings, seteditStoreTimings] = useState(false);
  const [selectedStoreTimings, setselectedStoreTimings] = useState();
  const [reloadStoreTimings, setreloadStoreTimings] = useState(false);

  // ? Faqs all models
  const [FaqsAddModel, setFaqsAddModel] = useState(false);
  const [FaqsDeleteModel, setFaqsDeleteModel] = useState(false);
  const [FaqsEditModel, setFaqsEditModel] = useState(false);
  const [SelectedFaqsData, setSelectedFaqsData] = useState();
  const [FaqsReload, setFaqsReload] = useState(false);

  // ? Extras models
  const [AddExtrasmodel, setAddExtrasmodel] = useState(false);
  const [EditExtrasmodel, setEditExtrasmodel] = useState(false);
  const [DeleteExtrasmodel, setDeleteExtrasmodel] = useState(false);
  const [SelectedExtras, setSelectedExtras] = useState("");
  const [reloadExtrasList, setreloadExtrasList] = useState(false);

  // ?  support model
  const [Supportshow, setSupportshow] = useState(false);
  const [Supportreload, setSupportreload] = useState(false);
  const [Supportdata, setSupportdata] = useState(false);
  const [Supportdelete, setSupportdelete] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        profiledata,
        setprofileData,
        isOpen,
        setIsOpen,

        // ✅ keep it in context
        is_subadmin,
        setIsSubadmin,

        //  for CMS page
        editorPPData,
        setEditorPPData,
        editorTCData,
        setEditorTCData,

        //  for CMS page
        forgotPasswordModel,
        setForgotPasswordModel,
        changePasswordshow,
        setchangePasswordshow,
        LogoutModalshow,
        setLogoutModalshow,

        // ! otp verify
        OtpverifyModel,
        setOtpverifyModel,
        mailOTP,
        setmailOTP,
        UpadatePasswordmodel,
        setUpadatePasswordmodel,

        // ! Provider all model
        Addprovidermodel,
        setAddprovidermodel,
        Editprovidermodel,
        setEditprovidermodel,
        Deleteprovidermodel,
        setDeleteprovidermodel,
        Selectedprovider,
        setSelectedprovider,
        reloadProviderList,
        setreloadProviderList,

        // ! Services all model
        AddServicemodel,
        setAddServicemodel,
        EditServicemodel,
        setEditServicemodel,
        DeleteServicemodel,
        setDeleteServicemodel,
        SelectedService,
        setSelectedService,
        reloadServiceList,
        setreloadServiceList,

        // ! zone model
        DeleteZonemodel,
        setDeleteZonemodel,
        SelectedZone,
        setSelectedZone,
        reloadZoneList,
        setreloadZoneList,
        DeleteSubZonemodel,
        setDeleteSubZonemodel,

        // ! Banner model
        AddBannermodel,
        setAddBannermodel,
        EditBannermodel,
        setEditBannermodel,
        DeleteBannermodel,
        setDeleteBannermodel,
        SelectedBanner,
        setSelectedBanner,
        reloadBannerList,
        setreloadBannerList,

        // ! Brand Model
        AddBrandmodel,
        setAddBrandmodel,
        EditBrandmodel,
        setEditBrandmodel,
        DeleteBrandmodel,
        setDeleteBrandmodel,
        SelectedBrand,
        setSelectedBrand,
        reloadBrandList,
        setreloadBrandList,

        // ! CarModel Model
        AddCarModelmodel,
        setAddCarModelmodel,
        EditCarModelmodel,
        setEditCarModelmodel,
        DeleteCarModelmodel,
        setDeleteCarModelmodel,
        SelectedCarModel,
        setSelectedCarModel,
        reloadCarModelList,
        setreloadCarModelList,

        // ! Assigned Model
        AddAssignedmodel,
        setAddAssignedmodel,
        EditAssignedmodel,
        setEditAssignedmodel,
        DeleteAssignedmodel,
        setDeleteAssignedmodel,
        SelectedAssigned,
        setSelectedAssigned,
        reloadAssignedList,
        setreloadAssignedList,

        // ! store time
        editStoreTimings,
        seteditStoreTimings,
        selectedStoreTimings,
        setselectedStoreTimings,
        reloadStoreTimings,
        setreloadStoreTimings,

        // ! for Faqs all models
        FaqsAddModel,
        setFaqsAddModel,
        FaqsDeleteModel,
        setFaqsDeleteModel,
        FaqsEditModel,
        setFaqsEditModel,
        SelectedFaqsData,
        setSelectedFaqsData,
        FaqsReload,
        setFaqsReload,

        // ! Extras
        AddExtrasmodel,
        setAddExtrasmodel,
        EditExtrasmodel,
        setEditExtrasmodel,
        DeleteExtrasmodel,
        setDeleteExtrasmodel,
        SelectedExtras,
        setSelectedExtras,
        reloadExtrasList,
        setreloadExtrasList,

        // ! Support model
        Supportshow,
        setSupportshow,
        Supportreload,
        setSupportreload,
        Supportdata,
        setSupportdata,
        Supportdelete,
        setSupportdelete,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContextProvider;
