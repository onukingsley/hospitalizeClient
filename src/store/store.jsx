import {create} from 'zustand'
import {generateDiagnosisId} from "../lib/mockData.js";
import {persist} from "zustand/middleware";

export const  userStore = create((set)=>{
    return {

        user: JSON.parse(localStorage.getItem('User')) || null,
        token: localStorage.getItem('Token') || null,
        setUser: (user,token)=>{
            set(()=>{
                localStorage.setItem('User',JSON.stringify(user))
                localStorage.setItem('Token',token)

                return {
                    user : user
                }
            })
        },
        updateUser: (user)=>{

            set(()=>{
                localStorage.setItem('User', JSON.stringify(user))

                return {
                    user: user
                }
            })

        },

        logoutUser: (user)=>{
            set(()=>{
                localStorage.removeItem('User')
                localStorage.removeItem('Token')

                return {
                    user: null,
                }
            })

        },

        doctor: null,
        setDoctor: (doctor)=>{
            set({doctor:doctor})
        },

        nurse: null,
        setNurse: (nurse)=>{
            set({nurse:nurse})
        },

        accountant: null,
        setAccountant: (accountant)=>{
            set({accountant:accountant})
        },
        pharmasist: null,
        setPharmasist: (pharmasist)=>{
            set({pharmasist:pharmasist})
        },
        labScientist: null,
        setLabScientist: (labScientist)=>{
            set({labScientist:labScientist})
        },
        clerk: null,
        setClerk: (clerk)=>{
            set({clerk:clerk})
        }
    }
})


export const diagnosisStore = create((set)=>{
    return{
        selectedDiagnosis: null,
        setSelectedDiagnosis : (diagnosis)=>{
            set({selectedDiagnosis: diagnosis})
        },



        inwardDiagnosis: [],
        setInwardDiagnosis: ((diagnosis)=>{
            set({inwardDiagnosis: diagnosis})
        }),

        outPatientDiagnosis:[],
        setOutPatientDiagnosis: ((diagnosis)=>{
            set({outPatientDiagnosis: diagnosis})
        }),
        totalPendingConsultation:null,
        setTotalPendingConsultation: ((consultation)=>{
            set({totalPendingConsultation: consultation})
        }),

        pendingConsultation:[],
        setPendingConsultation: ((consultation)=>{
            set({pendingConsultation: consultation})
        }),

        totalDailyConsultation:[],
        setTotalDailyConsultation: ((consultation)=>{
            set({totalDailyConsultation: consultation})
        }),

        dailyConsultation:[],
        setDailyConsultation: ((consultation)=>{
            set({dailyConsultation: consultation})
        }),


        doctorsDiagnosis:[],
        setDoctorsDiagnosis: ((diagnosis)=>{
            set({doctorsDiagnosis: diagnosis})
        }),

        diagnosisReport:[],
        setDiagnosisReport: ((diagnosisReport)=>{
            set({diagnosisReport: diagnosisReport})
        }),


        updateSelectedDiagnosis: ((fullDiagnosis)=>{
            set((state)=>{

                if (fullDiagnosis['status'] == 'inward' && state.selectedDiagnosis['status'] == 'outPatient'){
                    return {selectedDiagnosis: fullDiagnosis,
                        outPatientDiagnosis : state.outPatientDiagnosis.filter((item)=> item.id !== state.selectedDiagnosis.id ) ,
                        inwardDiagnosis : [...state.inwardDiagnosis, fullDiagnosis]
                    }
                }else if(fullDiagnosis['status'] == 'outPatient' && state.selectedDiagnosis['status'] == 'inward'){

                    return {selectedDiagnosis:fullDiagnosis,
                        inwardDiagnosis : state.inwardDiagnosis.filter((item)=> item.id !== state.selectedDiagnosis.id ) ,
                        outPatientDiagnosis : [...state.outPatientDiagnosis, fullDiagnosis]
                    }
                }

                return {selectedDiagnosis: fullDiagnosis}


            })
        }),

        consultations : [],
        setConsultations : ((consultations)=>{
           set({consultations:consultations})
        }),
        removeConsultation: ((consultation)=>{
           set((state)=>{
               const filteredConsultation = state.consultations.filter((item)=>item.id !== consultation.id)

               return {
                   consultations : filteredConsultation
               }
           })
        }),

        addConsultation: ((consultation)=>{
            set((state)=>{

                return {
                    consultations : [...state.consultations, consultation]
                }
            })
        }),

        /* for Pending Consultations*/
        awaitingConsultation: [],
        setAwaitingConsultation: ((consultations)=>{
            set({awaitingConsultation:consultations})
        }),

        addAwaitingConsultation: ((consultation)=>{
            set((state)=>{

                return {
                    pendingConsultation : [...state.pendingConsultation, consultation]
                }
            })
        }),
        removeAwaitingConsultation: ((consultation)=>{
            set((state)=>{
                const filteredConsultation = state.pendingConsultation.filter((item)=>item.id !== consultation.id)

                return {
                    pendingConsultation : filteredConsultation
                }
            })
        })


    }
})

export const labStore = create((set)=>{
    return {
        labTest: [],
        setLabTest: (tests) => {
            set({labTest: tests})
        },
        allLabTest: [],
        setAllLabTest: (tests) => {
            set({allLabTest: tests})
        },
        selectedLabTest: null,
        setSelectedLabTest: (labTest) => {
            set({selectedLabTest: labTest})

        },








        paidLabTest: [],
        setPaidLabTest: (tests) => {
            set({paidLabTest: tests})
        },

        updatePaidTest: ((updatedTest) => {
            set((state) => {
                return ({
                    paidLabTest: [updatedTest, ...state.paidLabTest]
                })
            })
        }),

        unpaidLabTest: [],
        setUnpaidLabTest: (tests) => {
            set({paidLabTest: tests})
        },


        updateSelectedLabTest: (test) => {
            set((state) => {

                const updatedLabTest = state.labTest.map((item) => {
                    if (item.id === test.id) {
                        return test
                    } else {
                        return item
                    }
                })

                return ({
                    selectedLabtest: test,
                    labTest: updatedLabTest
                })
            })
        },



        labStock: null,
        setLabStock: (labStock) => {
            set({labStock})
        },

        addLabStockRequest: ((labstock) => {
            set((state) => {
                return {labStock: [labstock, ...state.labStock]}
            })
        }),

        labOutOfStock: [],
        setLabOutOfStock : (stock)=>{
            set({labOutOfStock:stock})
        },
        labLowStock: [],
        setLabLowStock : (stock)=>{
            set({labLowStock:stock})
        },
        labPendingStock: [],
        setLabPendingStock : (stock)=>{
            set({labPendingStock:stock})
        },



        addLabRestockRequest: ((labstock) => {
            set((state) => {
                return {labRestockRequest: [labstock, ...state.labRestockRequest]}
            })
        }),

        labRestockRequest: null,
        setLabRestockRequest: (labRestockRequest) => {
            set({labRestockRequest})
        },


        myLabRestockRequest: [],

        setMyLabRestockRequest: (labRestockRequest) => {
            set({myLabRestockRequest:labRestockRequest})
        },

        pendingLabRestockRequest: [],

        setPendingLabRestockRequest: (labRestockRequest) => {
            set({pendingLabRestockRequest:labRestockRequest})
        },



        updatelabStock: ((labStock) => {
            return set((state) => {

                const newlabStock = state.labStock.map((item) => {
                    // return item.id === labStock.id? labStock:item

                    if (item.id === labStock.id) {
                        return labStock
                    } else {
                        return item
                    }

                })

                //return {labStock: newlabStock}

                return {labRestockRequest: newlabStock,
                    pendingLabRestockRequest : [labStock ,...state.pendingLabRestockRequest],
                    myLabRestockRequest : [labStock ,...state.myLabRestockRequest]
                }


            })
        }),

        updateLabRestockRequest: ((labStock) => {
            return set((state) => {

                const newlabStock = state.labRestockRequest.map((item) => {
                    // return item.id === labStock.id? labStock:item

                    if (item.id === labStock.id) {
                        return labStock
                    } else {
                        return item
                    }

                })

                return {labRestockRequest: newlabStock}

            })
        })


    }

})

export const paymentStore = create((set)=>{
    return {
        selectedPayment: null,
        setSelectedPayment : ((payment)=>{
            set({selectedPayment: payment})
        }),

        payments: [],
        setPayment:  ((payment)=>{
            set({payments: payment})
        }),
        creditPayments: [],
        setCreditPayment:  ((payment)=>{
            set({creditPayments: payment})
        }),

        debitPayments: [],
        setDebitPayment:  ((payment)=>{
            set({debitPayments: payment})
        }),

        totalRevenue: null,
        setTotalRevenue:  ((revenue)=>{
            set({totalRevenue: revenue})
        }),
        totalExpenses: null,
        setTotalExpenses:  ((expenses)=>{
            set({totalExpenses: expenses})
        }),

        totalDrugSale: null,
        setTotalDrugSale:  ((drugSale)=>{
            set({totalDrugSale: drugSale})
        }),

        totalLabTest: null,
        setTotalLabTest:  ((labTest)=>{
            set({totalLabTest: labTest})
        }),

        totalConsultation: null,
        setTotalConsultation:  ((consultation)=>{
            set({totalConsultation: consultation})
        }),

        pnlChart: [],
        setPnlChart:  ((chatData)=>{
            set({pnlChart: chatData})
        }),

        deptChart: [],
        setDeptChart:  ((chatData)=>{
            set({deptChart: chatData})
        }),



        totalSalary: null,
        setTotalSalary:  ((salary)=>{
            set({totalSalary: salary})
        }),




        addPayment:  ((payment) => {
            set((state) => {

                if (payment.status == 'debit'){
                    return {
                        payments: [payment, ...state.payments],
                        debitPayments: [payment, ...state.debitPayments],

                    }
                }if (payment.status == 'credit'){
                    return {
                        payments: [payment, ...state.payments],
                        creditPayments: [payment, ...state.creditPayments]

                    }
                }

                return {
                    payments: [payment, ...state.payments]

                }
            })
        }),

        rates:[],
        addRate: ((rate)=>{
            set((state)=>{
                /* state.drugs.push(drug)*/
                return {
                    rates: [rate, ...state.rates]
                }
            })
        }),
        setRate: (rate)=>{
            set({rates:rate})
        }



    }
})

 export const drugStore = create((set)=>{
     return {
         drugs : [],
         setDrugs : (drugsData)=>{

             //using immerse
            /* set((state)=>{
                 state.drugs = drugData;
             })*/

             set({drugs:drugsData})
         },
         addDrugs: ((drug)=>{
             set((state)=>{
                /* state.drugs.push(drug)*/
                 return {
                     drugs: [drug, ...state.drugs]
                 }
             })
         }),

         drugSale: [],
         setDrugSale : (salesData)=>{
             set({drugSale:salesData})
         },

         allDrugSale: [],
         setAllDrugSale : (salesData)=>{
             set({allDrugSale:salesData})
         },
         outOfStock: [],
         setOutOfStock : (salesData)=>{
             set({outOfStock:salesData})
         },
         lowStock: [],
         setLowStock : (salesData)=>{
             set({lowStock:salesData})
         },
         pendingDrugs: [],
         setPendingDrugs : (drugs)=>{
             set({pendingDrugs:drugs})
         },
         addDrugSale: ((drugSale)=>{
             set((state)=>{
                 /* state.drugs.push(drug)*/
                 return {
                     drugSale: [drugSale, ...state.drugSale]
                 }
             })
         }),

         selectedDrugSale: null,
         setSelectedDrugSale: (drug) => {
             set({selectedDrugSale: drug})

         },

         updateSelectedDrugSale: (sale) => {
             set((state) => {

                 const updatedDrugSale = state.drugSale.map((item) => {
                     if (item.id === sale.id) {
                         return sale
                     } else {
                         return item
                     }
                 })

                 return ({
                     selectedDrugSale: sale,
                     labTest: updatedDrugSale
                 })
             })
         },

         //todo: drugRestock, setDrugrestock, addDrugRestock

         drugRestockRequest: [],

         setDrugRestockRequest: (drugRestockRequest) => {
             set({drugRestockRequest:drugRestockRequest})
         },
         myDrugRestockRequest: [],

         setMyDrugRestockRequest: (drugRestockRequest) => {
             set({myDrugRestockRequest:drugRestockRequest})
         },

         pendingDrugRestockRequest: [],

         setPendingDrugRestockRequest: (drugRestockRequest) => {
             set({pendingDrugRestockRequest:drugRestockRequest})
         },


         addDrugRestockRequest: ((drugStock)=>{
             set((state)=>{
                 /* state.drugs.push(drug)*/
                 return {
                     drugSale: [drugStock, ...state.drugRestockRequest]
                 }
             })
         }),


         updateDrugRestockRequest: ((drugStock) => {
             return set((state) => {

                 const newDrugStock = state.drugRestockRequest.map((item) => {
                     // return item.id === labStock.id? labStock:item

                     if (item.id === drugStock.id) {
                         return drugStock
                     } else {
                         return item
                     }

                 })

                 return {drugRestockRequest: newDrugStock,
                     pendingDrugRestockRequest : [drugStock ,...state.pendingDrugRestockRequest],
                     myDrugRestockRequest : [drugStock ,...state.myDrugRestockRequest]
                 }

             })
         })

     }
 })

export const UnitReportStore = create((set)=>{
    return {
        report: [],
        setReport: (report)=>{
            set({report:report})
        },
        addReport: (report)=>{
            set((state)=>{
                return {
                    report: [report, ...state.report]
                }
            })
        }
    }
})


export const salaryLeaveStore = create((set)=>{

    return ({
        leaveApplication: [],
        setLeaveApplication: (leaveApplications)=>{
            set({leaveApplication:leaveApplications})
        },

        addLeaveApplication: (leaveApplications)=>{
            set((state)=>{
                return {
                    leaveApplication: [leaveApplications, ...state.leaveApplication]
                }
            })
        },
        pendingLeavingApplication: [],
        setPendingLeaveApplication: (leaveApplications)=>{
            set({pendingLeaveApplication:leaveApplications})
        },
        deniedLeavingApplication: [],
        setDeniedLeaveApplication: (leaveApplications)=>{
            set({deniedLeaveApplication:leaveApplications})
        },
        approvedLeavingApplication: [],
        setApprovedLeaveApplication: (leaveApplications)=>{
            set({approvedLeaveApplication:leaveApplications})
        },


        salary: [],
        setsalaryallowance: (salaryallowance)=>{
            set({salary:salaryallowance})
        },

        addSalary: (salary)=>{
            set((state)=>{
                return {
                    leaveApplication: [salary, ...state.salary]
                }
            })
        },

        cancelSalaryPayment: (salary)=>{
            set((state)=>{
                const filteredLeaveApplication = state.leaveApplication.filter(item=>salary.id !== item.id)
                return {

                    leaveApplication: filteredLeaveApplication
                }
            })
        },

        updateLeaveApplication: ((updatedLeaveApplication) => {
            return set((state) => {

                const updatedLeave = state.leaveApplication.map((item) => {
                    // return item.id === labStock.id? labStock:item

                    if (item.id === updatedLeaveApplication.id) {
                        return updatedLeaveApplication
                    } else {
                        return item
                    }

                })

                return {leaveApplication: updatedLeave}

            })
        })


    })
})

export const adminUserManagement = create(

        (set)=>{
            return {
                users: [],
                selectedUser : [],
                setUsers: (users)=>{
                    set({users:users})
                },

                staffs: [],
                setStaff: (staffs)=>{
                    set({staffs: staffs})
                },
                noOfStaffs: [],
                setnoOfStaff: (staffs)=>{
                    set({noOfStaffs: staffs})
                },

                addStaff: (staff)=>{
                    set((state)=>{
                        return {
                            staff: [staff, ...state.staffs]
                        }
                    })
                },
                removeStaff: (staff)=>{
                    set((state)=>{
                        const filteredStaffs = state.staffs.filter(item=>staff.id !== item.id)
                        return {

                            staffs: filteredStaffs
                        }
                    })
                },
                updateStaff: ((selectedStaff) => {
                    return set((state) => {

                        const updatedStaff = state.staffs.map((item) => {


                            if (item.id === selectedStaff.id) {
                                return selectedStaff
                            } else {
                                return item
                            }

                        })

                        return {staffs: updatedStaff}

                    })
                }),


                patients: [],
                setPatient: (patients)=>{
                    set({patients: patients})
                },
                dailyPatient: [],
                setDailyPatient: (patients)=>{
                    set({dailyPatient: patients})
                },

                totalPatient: [],
                setTotalPatient: (totalPatient)=>{
                    set({totalPatient: totalPatient})
                },


                addPatient: (staff)=>{
                    set((state)=>{
                        return {
                            patients: [staff, ...state.patients]
                        }
                    })
                },
                updatePatient: ((updatedPatient) => {
                    return set((state) => {

                        const updatedPat = state.patient.map((item) => {


                            if (item.id === updatedPatient.id) {
                                return updatedPatient
                            } else {
                                return item
                            }

                        })

                        return {staffs: updatedPat}

                    })
                }),

                removePatient: (patient)=>{
                    set((state)=>{
                        const filteredPatient = state.patients.filter(item=>patient.id !== item.id)
                        return {

                            patients: filteredPatient
                        }
                    })
                },

                pendingLabStock: [],
                approvedLabStock: [],
                setApprovedAndPendingLabStock: (approvedLabStock,pendingLabStock)=>{
                    set({approvedLabStock:approvedLabStock,pendingLabStock:pendingLabStock})
                },

                pendingDrugStock: [],
                approvedDrugStock:[],
                setPendingAndApprovedDrugStock: (pendingDrug,approvedDrug)=>{
                    set({pendingDrugStock:pendingDrug, approvedDrugStock:approvedDrug})
                },

                pendingStockRequest: [],
                approvedStockRequest:[],
                setApprovedAndPendingStockRequest: (pendingStockRequest,approvedStockRequest)=>{
                    set({pendingStockRequest:pendingStockRequest, approvedStockRequest:approvedStockRequest})
                },


                totalPaidDrugSale: null,
                totalUnpaidDrugSale: null,
                unPaidDrugSales: [],
                paidDrugSales: [],
                setTotalPaidAndUnpaidDrugSale: (totalpaidDrugStock,totalunpaidDrugStock,unpaidDrugStock,paidDrugStock)=>{
                    set({totalPaidDrugSale:totalpaidDrugStock, totalUnpaidDrugSale:totalunpaidDrugStock
                        ,paidDrugSales:paidDrugStock, unPaidDrugSales:unpaidDrugStock
                    })
                },

                paidConsultation: [],
                unPaidConsultation: [],
                totalPaidConsultation: null,
                totalUnpaidConsultation: null,
                setTotalPaidAndUnpaidConsultation: (paidConsultation,unPaidConsultation,totalPaidConsultation, totalUnpaidConsultation)=>{
                    set({paidConsultation:paidConsultation, unPaidConsultaion:unPaidConsultation
                        ,totalPaidConsultation:totalPaidConsultation,totalUnpaidConsultation:totalUnpaidConsultation
                    })
                },


                paidLabTest: [],
                unPaidLabTest: [],
                totalPaidLabTest: null,
                totalUnPaidLabTest: null,
                setTotalPaidAndUnpaidLabTest: (paidLabTest,unPaidLabTest,totalPaidLabTest, totalUnpaidLabTest)=>{
                    set({paidLabTest:paidLabTest, unPaidLabTest:unPaidLabTest
                        ,totalUnPaidLabTest:totalUnpaidLabTest,totalPaidLabTest:totalPaidLabTest
                    })
                },











            }
        })



export const selectedStore = create(
    persist(
       ( set)=>{
        return {
            selectedPatient:null,
            setSelectedPatient: (patient)=>{
                set({selectedPatient: patient})
            },
            selectedDiagnosis: null,
            setSelectedDiagnosis : (diagnosis)=>{
                set({selectedDiagnosis: diagnosis})
            },
            updateSelectedDiagnosis: ((fullDiagnosis)=>{
                set((state)=>{

                  /*  if (fullDiagnosis['status'] == 'inward' && state.selectedDiagnosis['status'] == 'outPatient'){
                        return {selectedDiagnosis: fullDiagnosis,
                            outPatientDiagnosis : state.outPatientDiagnosis.filter((item)=> item.id !== state.selectedDiagnosis.id ) ,
                            inwardDiagnosis : [...state.inwardDiagnosis, fullDiagnosis]
                        }
                    }else if(fullDiagnosis['status'] == 'outPatient' && state.selectedDiagnosis['status'] == 'inward'){

                        return {selectedDiagnosis:fullDiagnosis,
                            inwardDiagnosis : state.inwardDiagnosis.filter((item)=> item.id !== state.selectedDiagnosis.id ) ,
                            outPatientDiagnosis : [...state.outPatientDiagnosis, fullDiagnosis]
                        }
                    }*/

                    return {selectedDiagnosis: fullDiagnosis}


                })
            }),

        }
})
)




