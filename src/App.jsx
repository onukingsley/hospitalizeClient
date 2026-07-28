import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { seedDataIfNeeded } from '@/lib/dataStore';
import AppLayout from '@/components/layout/AppLayout';

// Auth
import LoginPage from '@/pages/auth/LoginPage';

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard';
import StaffManagement from '@/pages/admin/StaffManagement';

// Clerk
import ClerkDashboard from '@/pages/clerk/ClerkDashboard';
import PatientRegistration from '@/pages/clerk/PatientRegistration';
import PatientRecords from '@/pages/clerk/PatientRecords';
import PaymentCollection from '@/pages/clerk/PaymentCollection';

// Doctor
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import PatientDiagnosis from '@/pages/doctor/PatientDiagnosis';
import DiagnosisEntry from '@/pages/doctor/DiagnosisEntry';

// Lab
import LabDashboard from '@/pages/lab/LabDashboard';
import TestAndResults from '@/pages/lab/TestAndResults';

// Pharmacy
import PharmacyDashboard from '@/pages/pharmacy/PharmacyDashboard';
import DrugDispensing from '@/pages/pharmacy/DrugDispensing';
import DrugStock from '@/pages/pharmacy/DrugStock';

// Nurse
import NurseDashboard from '@/pages/nurse/NurseDashboard';
import DiagnosisUpdate from '@/pages/nurse/DiagnosisUpdate';
import DrugAdministration from '@/pages/nurse/DrugAdministration';

// Finance
import FinanceDashboard from '@/pages/finance/FinanceDashboard';
import ProfitLossAnalysis from '@/pages/finance/ProfitLossAnalysis';
import SalaryAllowances from '@/pages/finance/SalaryAllowances';

// Secretary
import SecretaryDashboard from '@/pages/secretary/SecretaryDashboard';
import LeaveApplicationPage from '@/pages/secretary/LeaveApplication';

// Patient
import PatientDashboard from '@/pages/patient/PatientDashboard';

// Shared
import ProfilePage from '@/pages/shared/ProfilePage';
import SettingsPage from '@/pages/shared/SettingsPage';
import {
    adminUserManagement,
    diagnosisStore,
    drugStore,
    labStore,
    paymentStore,
    salaryLeaveStore,
    UnitReportStore,
    userStore
} from "./store/store.jsx";
import AuthLayout from "./components/layout/authLayout.jsx";
import ClerkLayout from "./components/layout/ClerkLayout.jsx";
import DoctorLayout from "./components/layout/DoctorLayout.jsx";
import LabLayout from "./components/layout/LabLayout.jsx";
import NurseLayout from "./components/layout/NurseLayout.jsx";
import PharmacyLayout from "./components/layout/PharmacyLayout.jsx";
import AccountingLayout from "./components/layout/AccountingLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import axiosClient from "./service/axiosClient.js";
import PatientDetailsPage from "./pages/patient/PatientDetails.jsx";
import DiagnosisDetailsPage from "./pages/doctor/DiagnosisDetail.jsx";
import AllDiagnosis from "./pages/patient/AllDiagnosis.jsx";
import AllPatient from "./pages/patient/AllPatient.jsx";
import AllConsultaion from "./pages/patient/AllConsultation.jsx";
import DiagnosisEdit from "./pages/doctor/DiagnosisEdit.jsx";
import AddDiagnosisReport from "./pages/doctor/addDiagnosisReport.jsx";
import DiagnosisReportPage from "./pages/doctor/DIagnosisReporDetails.jsx";
import DiagnosisReportEdit from "./pages/doctor/DiagnosisReportEdit.jsx";
import AllDiagnosisReport from "./pages/doctor/AllDiagnosisReport.jsx";
import SaleDetailPage from "./pages/pharmacy/SalesDetais.jsx";
import PharmacyPatientDetailsPage from "./pages/pharmacy/PharmacyPatientDetail.jsx";
import DrugSales from "./pages/pharmacy/DrugSales.jsx";
import DrugRequestPage from "./pages/pharmacy/DrugRequest.jsx";
import LabOverview from "./pages/lab/LabOverview.jsx";
import AllLabPatient from "./pages/lab/AllLabPatient.jsx";
import LabStock from "./pages/lab/LabStock.jsx";
import AllLabTest from "./pages/lab/AllLabTest.jsx";
import AddLabStock from "./pages/lab/AddLabStock.jsx";
import NurseOverview from "./pages/nurse/NurseOverview.jsx";
import NurseDiagnosisDetail from "./pages/nurse/NurseDiagnosisDetail.jsx";
import NurseAllDiagnosisReport from "./pages/nurse/NurseAllDiagnosisReport.jsx";
import NurseAddDiagnosisReport from "./pages/nurse/NurseAddDiagnosisReport.jsx";
import NurseDiagnosisReportPage from "./pages/nurse/NurseDiagnosisReportDetail.jsx";
import NurseDiagnosisReportEdit from "./pages/nurse/NurseEditDiagnosisReport.jsx";
import NurseAllPatient from "./pages/nurse/AllNursePatient.jsx";
import ClerkConsultation from "./pages/clerk/ClerkConsultation.jsx";
import ClerkPatientDetailsPage from "./pages/clerk/ClerkPatientDetails.jsx";
import PaymentPage from "./pages/finance/PaymentPage.jsx";
import Settlement from "./pages/finance/Settlement.jsx";
import SettlementPage from "./pages/finance/Settlement.jsx";
import GenerateInvoice from "./pages/finance/GenerateInvoice.jsx";
import InvoiceDetails from "./pages/finance/InvoiceDetails.jsx";

function RoleRedirect() {
  const { isAuthenticated, user } = userStore();

  return <Navigate to={`/${user?.user_role}`} replace />;
}

function App() {
  const { user,setDoctor,doctor,setNurse,setClerk,setAccountant,setLabScientist,setPharmasist } = userStore();
  const {setLabStock,setLabRestockRequest,setLabTest,setLabLowStock,setLabPendingStock,setMyLabRestockRequest,setPendingLabRestockRequest,setAllLabTest,setLabOutOfStock} = labStore()
  const {setReport} = UnitReportStore()
  const {setUsers,setPatient,setStaff,setDailyPatient,setTotalPatient,setnoOfStaff,setApprovedAndPendingStockRequest,setTotalPaidAndUnpaidConsultation,setTotalPaidAndUnpaidDrugSale,setTotalPaidAndUnpaidLabTest,setPendingAndApprovedDrugStock,setApprovedAndPendingLabStock} = adminUserManagement()
  const {setAwaitingConsultation,setConsultations, setDailyConsultation, setPendingConsultation, setDiagnosisReport, setDoctorsDiagnosis,setInwardDiagnosis,setOutPatientDiagnosis,setTotalDailyConsultation,setTotalPendingConsultation} = diagnosisStore()
  const {setPayment,setCreditPayment,setDebitPayment,setRate,setTotalRevenue,setTotalExpenses,setTotalSalary,setTotalConsultation,setTotalDrugSale,setTotalLabTest,setDeptChart,setPnlChart} = paymentStore()
  const {setDrugs,setAllDrugSale,setDrugSale,setMyDrugRestockRequest,setPendingDrugRestockRequest,setDrugRestockRequest,setPendingDrugs,setLowStock,setOutOfStock} = drugStore()
  const {setLeaveApplication,setsalaryallowance,setPendingLeaveApplication,setApprovedLeaveApplication,setDeniedLeaveApplication} = salaryLeaveStore()

  useEffect(()=>{
      switch (user?.user_role){
          case 'doctor':
                axiosClient.get('/getDoctorOverview')
                    .then(({data})=>{

                        setDoctor(data.data.doctor)
                        setDoctorsDiagnosis(data.data.doctor.diagnosis)
                        setTotalDailyConsultation(data.data.noOfDailyConsultaion)
                        setTotalPendingConsultation(data.data.noOfPendingConsultation)
                        setDailyConsultation(data.data.dailyConsultation)
                        setReport(data.data.unitReport)
                        setPendingConsultation(data.data.dailyPendingConsultation)
                        setConsultations(data.data.doctor.consultation)
                        setDiagnosisReport(data.data.doctor.user.diagnosisReport)
                        setLeaveApplication(data.data.doctor.user.leaveApplication)
                        setsalaryallowance(data.data.doctor.user.salaryAllowances)
                        setInwardDiagnosis(data.data.inwardPatient)
                        setOutPatientDiagnosis(data.data.outPatient)
                        setPatient(data.data.patients)
                        setDrugs(data.data.drugs)
                        setRate(data.data.rates)






                    })

                    .catch(e=>console.log(e))
              break;
          case 'nurse':
              axiosClient.get('/getNurseOverview')
                  .then(({data})=>{
                    setNurse(data.data.nurse);
                    setDiagnosisReport(data.data.nurse.user.diagnosis_report)
                    setLeaveApplication(data.data.nurse.user.leaveApplication)
                    setsalaryallowance(data.data.nurse.user.salaryAllowances)
                    setReport(data.data.unitReport)
                    setOutPatientDiagnosis(Object.values(data.data.outPatient))
                    setInwardDiagnosis(Object.values(data.data.inwardPatient))
                      setPatient(data.data.patient)
                      console.log(data.data.nurse.user.diagnosis_report)

                  })

                  .catch(e=>console.log(e))
              break;
          case 'accountant':
              axiosClient.get('/getAccountantOverview')
                  .then(({data})=>{
                      setAccountant(data.data.accountant)
                      setRate(data.data.hospitalRates)
                      setsalaryallowance(data.data.salary)
                      setPayment(data.data.payments)
                      setDrugSale(data.data.drugSales)
                      setLabTest(data.data.labTests)
                      setCreditPayment(data.data.revenue)
                      setDebitPayment(data.data.expenses)
                      setReport(data.data.unitReport)
                      setTotalRevenue(data.data.totalRevenue)
                      setTotalExpenses(data.data.totalExpenses)
                      setDrugRestockRequest(data.data.stockRequest)
                      setPnlChart(data.data.pnlChart)
                      setDeptChart(data.data.deptChart)
                      setConsultations(data.data.consultations)
                      setTotalLabTest(data.data.totalLabTest)
                      setTotalDrugSale(data.data.totalDrugSale)
                      setTotalConsultation(data.data.totalConsultation)
                      setTotalSalary(data.data.totalSalary)
                  })

                  .catch(e=>console.log(e))
              break;
          case 'pharmasist':
              axiosClient.get('/getPharmasistOverview')
                  .then(({data})=>{
                      console.log(data)
                      setPharmasist(data.data.pharmasist)
                      setDrugs(data.data.drugStock)
                      setReport(data.data.unitReport)
                      setLowStock(Object.values(data.data.lowStock))
                      setOutOfStock(Object.values(data.data.outOfStock))
                      setDrugSale(data.data.pharmasist.sales)
                      setAllDrugSale(data.data.allDrugSale)
                      setLeaveApplication(data.data.pharmasist.user.leaveApplication)
                      setsalaryallowance(data.data.pharmasist.user.salaryAllowances)
                      //setDrugRestockRequest(data.data.pharmasist.user.stock_request)
                      setDrugRestockRequest(data.data.restockRequest)
                      setPendingDrugRestockRequest(data.data.pendingRestockRequest)
                      setMyDrugRestockRequest(data.data.myDrugRequest)
                      setTotalRevenue(data.data.totalRevenue)
                      setPendingDrugs(Object.values(data.data.pendingRequest))
                  })

                  .catch(e=>console.log(e))
              break;
          case 'labScientist':
              axiosClient.get('/getLabOverview')
                  .then(({data})=>{
                      setLabScientist(data.data.labAttendant)
                      setLabStock(data.data.allLabStock)
                      console.log(data.data.allLabStock)
                      setReport(data.data.unitReport)
                      setLabLowStock(Object.values(data.data.lowStock))
                      setLabOutOfStock(Object.values(data.data.outOfStock))
                      setLabTest(data.data.labAttendant.labtest)
                      setAllLabTest(data.data.allLabTest)
                      setLeaveApplication(data.data.labAttendant.user.leaveApplication)
                      setsalaryallowance(data.data.labAttendant.user.leaveApplication)
                      setLabRestockRequest(data.data.restockRequest)
                      setPendingLabRestockRequest(data.data.pendingRestockRequest)
                      setLabPendingStock(Object.values(data.data.pendingRequest))
                      console.log(Object.values(data.data.pendingRequest))
                      setMyLabRestockRequest(data.data.myLabRequest)
                      setTotalRevenue(data.data.totalRevenue)


                      setReport(data.unitReport)









                  })

                  .catch(e=>console.log(e))
              break;
          case 'clerk':
              axiosClient.get('/getClerkOverview')
                  .then(({data})=>{
                      setsalaryallowance(data.data.clerk.user.salaryAllowances)
                      setLeaveApplication(data.data.clerk.user.leaveApplication)
                      setReport(data.unitReport)
                      setPendingConsultation(data.data.pendingConsultation)
                      setDailyConsultation(data.data.dailyConsultation)
                      setTotalDailyConsultation(data.data.noOfDailyConsultation)
                      setTotalPendingConsultation(data.data.noOfPendingConsultation)
                      console.log(data.data.pendingConsultation)
                      setInwardDiagnosis(Object.values(data.data.inwardPatient))
                      setOutPatientDiagnosis(Object.values(data.data.outPatient))
                      setDailyPatient(data.data.dailyPatient)
                      setPatient(data.data.allPatient)
                      setTotalPatient(data.data.totalPatient)
                      setRate(data.data.rates)
                      console.log(data.data.rates)
                      setClerk(data.data.clerk)
                  })

                  .catch(e=>console.log(e))
              break;

          case 'admin':
              axiosClient.get('/getAdminOverview')
                  .then(({data})=>{
                     setUsers(data.users)
                      setStaff(data.allStaff)
                      setnoOfStaff(data.noOfStaff)
                      setDrugs(data.drugStock)
                      setPendingDrugs(data.pendingDrugStock)
                      setPayment(data.payments)
                      setDrugSale(data.drugSales)
                      setLabTest(data.labTests)
                      setConsultations(data.consultations)
                      setDrugRestockRequest(data.stockRequest)
                      setsalaryallowance(data.salary)
                      setReport(data.unitReport)
                      setRate(data.hospitalRates)
                      setCreditPayment(data.revenue)
                      setDebitPayment(data.expenses)
                      setTotalRevenue(data.totalRevenue)
                      setTotalExpenses(data.totalExpenses)
                      setLeaveApplication(data.leaveApplication)
                      setPendingLeaveApplication(data.pendingLeaveApplication)
                      setDeniedLeaveApplication(data.deniedLeaveApplication)
                      setApprovedLeaveApplication(data.ApprovedLeaveApplication)
                      setApprovedAndPendingStockRequest(data.pendingStockRequest,data.approvedStockRequest)
                      setApprovedAndPendingLabStock(data.approvedLabStock,data.pendingLabStock)
                      setPendingAndApprovedDrugStock(data.pendingDrugStock,data.approvedDrugStock)
                      setInwardDiagnosis(data.inwardPatient)
                      setOutPatientDiagnosis(data.outPatient)
                      setTotalPaidAndUnpaidDrugSale(data.paidDrugSalesCount,data.unpaidDrugSalesCount,data.unpaidDrugSales,data.paidDrugSales)
                      setTotalPaidAndUnpaidConsultation(data.paidConsultation,data.unpaidConsultation,data.paidConsultationCount,data.unpaidConsultationCount)
                      setTotalPaidAndUnpaidLabTest(data.paidLabTests,data.unpaidLabTests,data.paidLabTestCount,data.unpaidLabTestsCount)



                  })

                  .catch(e=>console.log(e))
              break;
      }





  },[user])
  useEffect(() => {
    seedDataIfNeeded();
  }, []);

  // If not authenticated, show only login page without AppLayout


  // If authenticated, show all routes with AppLayout

  return (
      <Routes>



        <Route path="/login" element={<LoginPage />} />

        <Route element={<ClerkLayout/>}>
          <Route path="/clerk" element={<ClerkDashboard />} />
          <Route path="/clerk/registration" element={<PatientRegistration />} />
          <Route path="/clerk/consultation" element={<ClerkConsultation />} />
            <Route path="/clerk/patientDetail/:id" element={<ClerkPatientDetailsPage />} />
          <Route path="/clerk/patients" element={<PatientRecords />} />
          <Route path="/clerk/payments" element={<PaymentCollection />} />
          <Route path="/clerk/queue" element={<ClerkDashboard />} />
          <Route path="/labprofile" element={<ProfilePage />} />
          <Route path="/labsettings" element={<SettingsPage />} />
        </Route>

          <Route element={<DoctorLayout/>}>
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/diagnosis" element={<AllDiagnosis />} />
              <Route path="/doctor/editdiagnosis" element={<DiagnosisEdit />} />
              <Route path="/doctor/editdiagnosisReport" element={<DiagnosisReportEdit />} />
              <Route path="/doctor/diagnosis/new" element={<DiagnosisEntry />} />
              <Route path="/doctor/diagnosisReport/new" element={<AddDiagnosisReport />} />
              <Route path="/doctor/consultation" element={<AllConsultaion />} />
              <Route path="/doctor/patients" element={<AllPatient />} />
              <Route path="/doctor/patientDetail/:id" element={<PatientDetailsPage />} />
              <Route path="/doctor/diagnosisDetail/:id" element={<DiagnosisDetailsPage />} />
              <Route path="/doctor/diagnosisReportDetail" element={<DiagnosisReportPage />} />
              <Route path="/doctor/AlldiagnosisReport" element={<AllDiagnosisReport />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route element={<LabLayout/>}>
              <Route path="/labScientist" element={<LabOverview />} />
              <Route path="/lab/tests" element={<TestAndResults />} />
              <Route path="/lab/patients" element={<AllLabPatient />} />
              <Route path="/lab/reports" element={<TestAndResults />} />
              <Route path="/lab/equipment" element={<LabStock />} />
              <Route path="/lab/alllabtest" element={<AllLabTest />} />
              <Route path="/lab/addlabstock" element={<AddLabStock />} />
              <Route path="/lab/upload" element={<TestAndResults />} />
              <Route path="/labprofile" element={<ProfilePage />} />
              <Route path="/labsettings" element={<SettingsPage />} />

          </Route>



          <Route element={<NurseLayout/>}>
              {/*<Route path="/nurse" element={<NurseDashboard />} />*/}
              <Route path="/nurse" element={<NurseOverview />} />
              <Route path="/nurse/diagnosis-update" element={<DiagnosisUpdate />} />
              <Route path="/nurse/drug-admin" element={<DrugAdministration />} />
              <Route path="/nurse/remarks" element={<DiagnosisUpdate />} />
              <Route path="/nurse/wards" element={<NurseDashboard />} />
              <Route path="/nurse/patients" element={<NurseAllPatient />} />
              <Route path="/nurse/diagnosisDetail/:id" element={<NurseDiagnosisDetail />} />
              <Route path="/nurse/diagnosisReport/new" element={<NurseAddDiagnosisReport />} />
              <Route path="/nurse/AlldiagnosisReport" element={<NurseAllDiagnosisReport />} />
              <Route path="/nurse/patientDetail/:id" element={<PatientDetailsPage />} />
              <Route path="/nurse/diagnosisReportDetail" element={<NurseDiagnosisReportPage />} />
              <Route path="/nurse/editdiagnosisReport" element={<NurseDiagnosisReportEdit />} />

              <Route path="/nurseprofile" element={<ProfilePage />} />
              <Route path="/nursesettings" element={<SettingsPage />} />
          </Route>


              <Route element={<PharmacyLayout/>}>
                  <Route path="/pharmasist" element={<PharmacyDashboard />} />
                  <Route path="/pharmacy/dispense" element={<DrugDispensing />} />
                  <Route path="/pharmacy/stock" element={<DrugStock />} />
                  <Route path="/pharmacy/saleDetails" element={<SaleDetailPage />} />
                  <Route path="/pharmacy/patientDetails" element={<PharmacyPatientDetailsPage />} />
                  <Route path="/pharmacy/requests" element={<DrugRequestPage />} />
                  <Route path="/pharmacy/sales" element={<DrugSales />} />
                  <Route path="/pharmacy/all-sales" element={<PharmacyDashboard />} />
                  <Route path="/pharmacyprofile" element={<ProfilePage />} />
                  <Route path="/pharmacysettings" element={<SettingsPage />} />
              </Route>

          <Route element={<AccountingLayout/>}>
              <Route path="/accountant" element={<FinanceDashboard />} />
              <Route path="/finance/payments" element={<PaymentPage />} />
              <Route path="/finance/invoice" element={<GenerateInvoice />} />
              <Route path="/finance/invoiceDetails" element={<InvoiceDetails />} />
              <Route path="/finance/settlement" element={<SettlementPage />} />
              <Route path="/finance/pl-analysis" element={<ProfitLossAnalysis />} />
              <Route path="/finance/salary" element={<SalaryAllowances />} />
              <Route path="/finance/purchases" element={<FinanceDashboard />} />
              <Route path="/finance/reports" element={<ProfitLossAnalysis />} />
              <Route path="/finance/billing" element={<PaymentCollection />} />
              <Route path="/accountprofile" element={<ProfilePage />} />
              <Route path="/accountsettings" element={<SettingsPage />} />
          </Route>

          <Route element={<AdminLayout/>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/staff" element={<StaffManagement />} />
            <Route path="/admin/departments" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminDashboard />} />
            <Route path="/admin/config" element={<SettingsPage />} />
            <Route path="/adminProfile" element={<ProfilePage />} />

          </Route>

        <Route element={<AppLayout />}>

            {/* Root Redirect */}
          {/*  <Route
                path="/"
                element={<Navigate to={`/${user?.user_role}`} replace />}
            />*/}

            {/* Shared */}
          {/*  <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />*/}

            {/* Admin */}


            {/* Pharmacy */}


            {/* Nurse */}


            {/* Finance */}


            {/* Secretary */}
            <Route path="/secretary" element={<SecretaryDashboard />} />
            <Route path="/secretary/leave" element={<LeaveApplicationPage />} />
            <Route path="/secretary/appointments" element={<SecretaryDashboard />} />
            <Route path="/secretary/mail" element={<SecretaryDashboard />} />
            <Route path="/secretary/reports" element={<SecretaryDashboard />} />

            {/* Patient */}
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/diagnosis" element={<PatientDashboard />} />
            <Route path="/patient/lab-results" element={<PatientDashboard />} />
            <Route path="/patient/bills" element={<PatientDashboard />} />
            <Route path="/patient/appointments" element={<PatientDashboard />} />
            <Route path="/patient/complaints" element={<PatientDashboard />} />

            {/* 404 Redirect */}
           {/* <Route
                path="*"
                element={<Navigate to={`/${user?.user_role}`} replace />}
            />*/}

          </Route>


      </Routes>
  );
}

export default App;