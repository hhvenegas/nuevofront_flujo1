import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ElementRef
} from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { isPlatformBrowser } from "@angular/common";
import { QuotationService } from "../../services/quotation.service";
import { HubspotService } from "../../services/hubspot.service";
import { OperatorsService } from "../../services/operators.service";
import { UsersService } from "../../services/users.service";
import { PaginationService } from "../../services/pagination.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Location } from "@angular/common";
import { Maker } from "../../constants/maker";
import { Year } from "../../constants/year";
import { Model } from "../../constants/model";
import { Version } from "../../constants/version";
import { Quotation } from "../../constants/quotation";
import { Seller } from "../../constants/seller";
import { LoginService } from "../../services/login.service";
import { LoaderService } from "../../services/loader.service";

declare var $: any;
import swal from "sweetalert";
import { IfStmt } from "@angular/compiler";

@Component({
  selector: "app-panelpolicies",
  templateUrl: "./panelpolicies.component.html",
  styleUrls: ["./panelpolicies.component.scss"]
})
export class PanelpoliciesComponent implements OnInit {
  seller:any;
  filters: any = "";
  policies_info: any = {}
  /* policies_info: any = {
  seller: any;
  filters: any = "";
  policies_info: any = {
    page: 1,
    pages: 1,
    pagination: Array(),
    total: 0,
    seller_id: "",
    policy_states: "",
    km_states: "",
    membership_states: "",
    seller_states: "",
    device_states: "",
    vin_states: "",
    search: "",
    from_date: "",
    to_date: "",
    tracking_department_id: "",
    call_topic_id: ""
  };*/
  filters_tracking: any = Array();
  policies: any = Array();
  devices: any = Array();
  policy_device: any = {
    policy_id: "",
    device_id: "",
    imei: ""
  };
  policy_assign_seller: any = {
    email: "",
    policy_id: "",
    seller_id: "",
    hubspot_id: ""
  };
  policy_user: any = {
    policy_id: "",
    sxkm_id: "",
    user_id_old: "",
    email_old: "",
    user_id_new: "",
    email_new: "",
    users: Array(),
    password: "",
    subscription_id: ""
  };
  policy_delete: any = {
    policy_id: "",
    sxkm_id: "",
    password: "",
    reason: ""
  };
  tracking: any = {
    id: 0,
    type: 1,
    future_call: false,
    date: "",
    time: "",
    customer_tracking: Array()
  };
  tracking_options: any = {
    areas: Array(),
    area: {
      id: 1,
      name: "",
      call_topics: Array(),
      tracking_close_reasons: Array(),
      call_types: Array(),
      call_results: Array()
    }
  };

  tracking_customer: any = {
    customer_tracking: {
      customer_id: 0,
      policy_id: 0,
      tracking_department_id: null,
      coment: ""
    },
    tracking_call: {
      call_topic_id: null,
      call_type_id: null,
      assigned_user_id: null,
      scheduled_call_date: "",
      call_result_id: null,
      note: ""
    },
    close_tracking: true
  };
  sellers: any = Array();
  link: any = "https://app.sxkm.mx";
  excel: any = "";
  reasons_cancel: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private quotationService: QuotationService,
    private hubspotService: HubspotService,
    private operatorsService: OperatorsService,
    private spinner: NgxSpinnerService,
    private paginationService: PaginationService,
    private loginService: LoginService,
    private usersService: UsersService,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.loader.show();
    this.seller = this.loginService.getSession();

    this.operatorsService.getSellers().subscribe((data: any) => {
      if (data.result) this.sellers = data.sellers;
    });
    if (this.seller.rol < 3) this.policies_info.seller_id = this.seller.id;
    this.operatorsService.getReasonsCancelPolicy().subscribe((data: any) => {
      if (data) {
        this.reasons_cancel = data;
      }
    });
    this.initPolicies();
  }
  
  
  initPolicies() {
    if (localStorage.getItem("policies_info")) {
      let policies = JSON.parse(localStorage.getItem("policies_info"));
      
      this.policies_info = {
        /* page: 1,
        total: policies.total, */
        seller_id: policies.seller_id,
        policy_states: policies.policy_states,
        km_states: policies.km_states,
        membership_states: policies.membership_states,
        seller_states: policies.seller_states,
        device_states: policies.device_states,
        vin_states: policies.vin_states,
        search: policies.search,
        from_date: policies.from_date,
        to_date: policies.to_date,
        tracking_department_id: policies.tracking_department_id,
        call_topic_id: policies.call_topic_id
      }
      let element_select = [];
      console.log("POLICIES_INFO NEW",this.policies_info)
      /* debugger */
      for(var key in this.policies_info){
        if(this.policies_info.hasOwnProperty(key)){
          if(this.policies_info[key] !== ""){
            if(key == "from_date" || key == "to_date" || key == "seller_id"){
            
            }else{
              element_select.push(`"${key}":"${this.policies_info[key]}"`)
            }
          }
        }
      }
      console.log("selectores",element_select)
      this.filters = ""
      if(element_select.length > 1){
        this.filters = "{"+element_select[1] + "," + element_select[0]+"}"
      }else if(element_select.length == 1){
        this.filters = "{"+element_select[0]+"}"
      }
      console.log("filtros", this.filters)


      /* for(let i=0; element_select.length >= i; i++){
        this.filters = element_select[i]
      } */
      this.policies_info.page = 1
      this.policies_info.total = policies.total
      /* if(this.policies_info.tracking_department_id!=""){
        this.operatorsService.getTrackingOptions()
        .subscribe((data:any)=>{
          if(data.result){
            this.tracking_options.departments = data.data.departments 
            this.tracking_options = {
              areas: data.data,
              area: data.data[0]
            };
            this.policies_info.call_topic_id = "";
            
            this.filters_tracking= this.tracking_options.areas[this.policies_info.tracking_department_id-1];
            this.policies_info.call_topic_id = this.policies_info.call_topic_id
            
            this.getPolicies();
          }
        });
      } else {
        this.policies_info.to_date = this.policies_info.from_date
        this.operatorsService.getTrackingOptions().subscribe((data: any) => {
          if (data.result) {
            this.tracking_options.departments = data.data.departments;
            this.tracking_options = {
              areas: data.data,
              area: data.data[0]
            };
            this.getPolicies();
          }
        });
      } */
    }else{
      this.policies_info = {
        page: 1,
        pages: 1,
        pagination: Array(),
        total: 1,
        seller_id: "",
        policy_states: "",
        km_states: "",
        membership_states: "",
        seller_states:"",
        device_states: "",
        vin_states: "",
        search: "",
        from_date: "",
        to_date: "",
        tracking_department_id: "",
        call_topic_id: ""
      }
      let dateInit = new Date();
      let year = dateInit.getFullYear();
      let month:any = dateInit.getMonth()+1;
      let day = dateInit.getDate();
      if(month < 10) this.policies_info.from_date = year+"-0"+month;
      else this.policies_info.from_date = year+"-"+month;
      if(day < 10) this.policies_info.from_date += "-0"+day;
      else this.policies_info.from_date += "-"+day;
    } 

    if(this.policies_info.tracking_department_id!=""){
      this.operatorsService.getTrackingOptions()
      .subscribe((data:any)=>{
        if(data.result){
          this.tracking_options.departments = data.data.departments 
          this.tracking_options = {
            areas: data.data,
            area: data.data[0]
          };
          this.policies_info.call_topic_id = "";

          this.filters_tracking= this.tracking_options.areas[this.policies_info.tracking_department_id-1];
          this.policies_info.call_topic_id = this.policies_info.call_topic_id

          this.getPolicies();
        }
      });
    } else {
      this.policies_info.to_date = this.policies_info.from_date
      this.operatorsService.getTrackingOptions().subscribe((data: any) => {
        if (data.result) {
          this.tracking_options.departments = data.data.departments;
          this.tracking_options = {
            areas: data.data,
            area: data.data[0]
          };
          this.getPolicies();
        }
      });
    }
  }


  getPolicies() {
    this.policies_info.pagination = Array();
    this.policies_info.pages = 1;
    this.policies_info.total = 0;
    this.loader.show();

    if(!this.policies_info.to_date)
    this.policies_info.to_date = this.policies_info.from_date;
		if(this.policies_info.to_date<this.policies_info.from_date)
    this.policies_info.to_date = this.policies_info.from_date;
    if(!this.policies_info.policy_states)
    /* this.filters = this.policies_info.policy_states */
    this.policies_info.seller_id = this.policies_info.seller_id
    console.log("POLIZA INFO",this.policies_info)
    /* debugger; */
    /* localStorage.setItem("policies_info",JSON.stringify(this.policies_info)); */
    this.operatorsService.getPolicies(this.policies_info)
    .subscribe((data:any)=>{
      console.log(data)
      this.policies=data.policies;
      this.excel = this.link+data.export_url;
      console.log(this.excel)
      this.policies_info.total = data.total_rows;
      this.policies_info.pages = data.pages;
      this.policies_info.pagination = this.paginationService.getPager(this.policies_info.pages,this.policies_info.page,10);
      this.loader.hide();
      console.log(this.policies_info)
    });
  }

  searchPolicies() {
    this.policies_info.seller_id = "";
    this.policies_info.policy_states = "";
    this.policies_info.km_states = "";
    this.policies_info.membership_states = "";
    this.policies_info.seller_states = "";
    this.policies_info.device_states = "";
    this.policies_info.vin_states = "";
    this.policies_info.from_date = "";
    this.policies_info.to_date = "";
    this.policies_info.tracking_department_id = "";
    this.policies_info.call_topic_id = "";
    this.filters = "";
    this.getPolicies();
  }

  setFilters(){
   /*  this.policies_info.seller_id = ""; */
    this.policies_info.policy_states = "";
    this.policies_info.km_states = "";
    this.policies_info.membership_states = "";
    this.policies_info.seller_states = "";
    this.policies_info.device_states = "";
    this.policies_info.vin_states = "";
    /* this.policies_info.from_date = "";
    this.policies_info.to_date = ""; */
    this.policies_info.tracking_department_id = "";
    this.policies_info.call_topic_id = "";
    var filters = JSON.parse(this.filters);
    if (filters['policy_states'] !== "" && filters['policy_states']) this.policies_info['policy_states'] = filters['policy_states']
    if (filters['membership_states'] !== "" && filters['membership_states']) this.policies_info['membership_states'] = filters['membership_states']
    if (filters['km_states'] !== "" && filters['km_states']) this.policies_info['km_states'] = filters['km_states']
    if (filters['seller_states'] !== "" && filters['seller_states']) this.policies_info['seller_states'] = filters['seller_states']
    if (filters['device_states'] !== "" && filters['device_states']) this.policies_info['device_states'] = filters['device_states']
    if (filters['vin_states'] !== "" && filters['vin_states']) this.policies_info['vin_states'] = filters['vin_states']
    console.log('this.policies_info', this.policies_info)

    this.getPolicies();

  }


  changeDepartmentSearch(type) {
    if (type == 1) {
      this.policies_info.call_topic_id = "";
      if (this.policies_info.tracking_department_id != "")
        this.filters_tracking = this.tracking_options.areas[
          this.policies_info.tracking_department_id - 1
        ];
    }

    this.getPolicies();
  }

  //Asignar dispositivo
  setDevice(policy_id, device_id, imei) {
    this.policy_device = {
      policy_id: policy_id,
      device_id: device_id,
      imei: imei
    };
  }
  changeDevice() {
    this.operatorsService
      .searchDevice(this.policy_device.imei)
      .subscribe((data: any) => {
        console.log(data);
        let bool = false;
        this.devices = data.devices;
        data.devices.forEach(element => {
          if (element.imei == this.policy_device.imei) {
            bool = true;
            if (element.status == "in_stock") {
              this.policy_device.device_id = element.id;
              this.operatorsService
                .updateDevicePolicy(this.policy_device)
                .subscribe((data: any) => {
                  if (data.result) {
                    this.policies.forEach(item => {
                      if (item.id == this.policy_device.policy_id) {
                        item.device.id = this.policy_device.device_id;
                        item.device.imei = this.policy_device.imei;
                        item.device.assigned = true;
                        $("#modalChangeDevice").modal("hide");
                        swal(
                          "El dispositivo se asigno correctamente ",
                          "",
                          "success"
                        );
                      }
                    });
                  } else
                    swal(
                      "No se pudo asignar el dispositivo ",
                      "El dispositivo se encuentra asignado",
                      "error"
                    );
                });
            } else
              swal(
                "No se pudo asignar el dispositivo ",
                "El dispositivo se encuentra asignado",
                "error"
              );
          }
        });
        if (!bool)
          swal(
            "Hubo un problema",
            "No se pudo asignar el dispositivo porque el IMEI no existe",
            "error"
          );
      });
  }
  //Cambiar de vendedor
  setPolicyAssignSeller(email, policy_id, seller_id) {
    this.policy_assign_seller = {
      email: email,
      policy_id: policy_id,
      seller_id: seller_id,
      hubspot_id: ""
    };
    if (seller_id == null) this.policy_assign_seller.seller_id = "";
  }
  changeSeller() {
    this.sellers.forEach(element => {
      if (this.policy_assign_seller.seller_id == element.id)
        this.policy_assign_seller.hubspot_id = element.hubspot_id;
    });

    let full_name = "";
    let seller_id = this.policy_assign_seller.seller_id;
    console.log(this.policy_assign_seller);
    this.operatorsService
      .updateSellerPolicy(
        this.policy_assign_seller.policy_id,
        this.policy_assign_seller.seller_id
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data.result) {
          this.sellers.forEach(item => {
            if (item.id == this.policy_assign_seller.seller_id) {
              full_name = item.full_name;
              seller_id = item.id;
            }
          });
          console.log("Nombre: " + full_name);
          this.policies.forEach(item => {
            if (item.id == this.policy_assign_seller.policy_id) {
              if (item.seller) {
                item.seller.id = seller_id;
                item.seller.full_name = full_name;
              } else {
                item.seller = {
                  id: seller_id,
                  full_name: full_name
                };
              }
              swal("Se ha cambiado al vendedor correctamente", "", "success");
              this.validateAccessToken();
            }
          });
        } else swal("No se pudo asignar al vendedor ", "", "error");
      });
  }

  //Cambiar usuario de poliza
  setPolicyChangePolicyUser(
    policy_id,
    sxkm_id,
    user_id_old,
    email_old,
    subscription
  ) {
    let subscription_id = "";
    if (subscription) subscription_id = subscription.id;
    this.policy_user = {
      policy_id: policy_id,
      sxkm_id: sxkm_id,
      user_id_old: user_id_old,
      email_old: email_old,
      user_id_new: "",
      email_new: "",
      users: Array(),
      subscription_id: subscription_id
    };
    console.log("Cambiar poliza");
    console.log(this.policy_user);
  }
  updateChangePolicyUser() {
    this.loader.show(); //
    this.operatorsService
      .validatePassword(this.seller.id, this.policy_delete.password)
      .subscribe((data: any) => {
        console.log(data);
        if (data.result) {
          if (this.policy_user.user_id_new == "") {
            this.operatorsService
              .validateUser(this.policy_user.email_new)
              .subscribe((data: any) => {
                console.log(data);
                if (data.result) {
                  this.loader.hide();
                  this.policy_user.users = data.data;
                  swal(
                    "El correo  ya existe",
                    "Selecciona el correo de usuario existente",
                    "warning"
                  );
                } else {
                  this.changeUserPolicy();
                }
              });
          } else this.changeUserPolicy();
        } else {
          this.loader.hide();
          swal(
            "No se pudo cambiar el correo",
            "La contraseña ingresada no es correcta inténtalo de nuevo",
            "error"
          );
        }
      });
  }
  changeUserPolicy() {
    let user = {
      new_user_id: this.policy_user.user_id_new,
      email: this.policy_user.email_new,
      policy_id: this.policy_user.policy_id
    };
    if (this.policy_user.user_id_new != "") user.email = "";
    //console.log(this.policy_user)
    console.log("Datos para enviar");
    console.log(user);

    if (this.policy_user.subscription_id != "") {
      this.loader.hide();
      swal(
        "Ésta póliza tiene suscripción, ¿Estás seguro que deseas cambiar de usuario?",
        "Si cambias de usuario, la suscripción se cancelará",
        {
          buttons: ["Cancelar", "Aceptar"]
        }
      ).then(value => {
        if (value) {
          this.loader.show();
          this.operatorsService
            .changeUserEmail(this.policy_user.user_id_old, user)
            .subscribe((data2: any) => {
              console.log(data2);
              if (data2.result) {
                let i = 0;
                let j = 0;
                this.policies.forEach(element => {
                  if (this.policy_user.policy_id == element.id) {
                    j = i;
                  }
                  i++;
                });
                this.policies[j].user.id = data2.data.user.id;
                this.policies[j].user.email = data2.data.user.email;
                $("#modalChangeUser").modal("hide");
                this.loader.hide();
                swal("Se ha reasignado la póliza correctamente", "", "success");
              } else {
                this.loader.hide();
                swal(
                  "Hubo un problema",
                  "No se pudo reasignar el correo a la póliza",
                  "error"
                );
              }
            });
        }
      });
    } else {
      this.operatorsService
        .changeUserEmail(this.policy_user.user_id_old, user)
        .subscribe((data2: any) => {
          console.log(data2);
          if (data2.result) {
            let i = 0;
            let j = 0;
            this.policies.forEach(element => {
              if (this.policy_user.policy_id == element.id) {
                j = i;
              }
              i++;
            });
            this.policies[j].user.id = data2.data.user.id;
            this.policies[j].user.email = data2.data.user.email;
            $("#modalChangeUser").modal("hide");
            this.loader.hide();
            swal("Se ha reasignado la póliza correctamente", "", "success");
          } else {
            this.loader.hide();
            swal(
              "Hubo un problema",
              "No se pudo reasignar el correo a la póliza"
            );
          }
        });
    }
  }

  //Cancelar póliza
  setPolicyDelete(policy_id, sxkm_id) {
    this.policy_delete = {
      policy_id: policy_id,
      sxkm_id: sxkm_id,
      password: "",
      reason: ""
    };
  }
  deletePolicyModal() {
    this.loader.show();
    this.operatorsService
      .validatePassword(this.seller.id, this.policy_delete.password)
      .subscribe((data: any) => {
        console.log(data);
        if (data.result) {
          this.operatorsService
            .getSubscriptionsByPolicy(this.policy_delete.policy_id)
            .subscribe((data2: any) => {
              console.log(data2);
              if (data2.result) {
                if (data2.subscriptions.length > 1) {
                  this.operatorsService
                    .cancelPolicy(
                      this.policy_delete.policy_id,
                      this.policy_delete.reason
                    )
                    .subscribe((data: any) => {
                      console.log(data);
                      $("#modalCancelPolicy").modal("hide");
                      this.loader.hide();
                      if (data.result) {
                        this.policies.forEach(element => {
                          if (element.id == this.policy_delete.policy_id)
                            element.status = "canceled";
                        });
                        swal(data.msg, "", "success");
                      } else {
                        swal("Hubo un problema", data.msg, "error");
                      }
                    });
                } else {
                  swal(
                    "Ésta poliza tiene suscripción",
                    "Da click en continuar para cancelar la póliza",
                    {
                      buttons: ["Cancelar", "Aceptar"]
                    }
                  ).then(value => {
                    console.log(value);
                    if (value) {
                      this.operatorsService
                        .cancelPolicy(
                          this.policy_delete.policy_id,
                          this.policy_delete.reason
                        )
                        .subscribe((data: any) => {
                          console.log(data);
                          $("#modalCancelPolicy").modal("hide");
                          this.loader.hide();
                          if (data.result) {
                            this.policies.forEach(element => {
                              if (element.id == this.policy_delete.policy_id)
                                element.status = "canceled";
                            });
                            swal(data.msg, "", "success");
                          } else {
                            swal("Hubo un problema", data.msg, "error");
                          }
                        });
                    }
                  });
                }
              }
            });
        } else {
          this.loader.hide();
          $("#modalCancelPolicy").modal("hide");
          swal(
            "No se pudo cancelar la póliza",
            "La contraseña es incorrecta",
            "error"
          );
        }
      });
  }
  //Tracking
  setCustomerTracking(type, policy, tracking_id = null) {
    this.cleanForm()
    console.log("TRACKING");
    this.tracking.type = type;
    this.tracking.id = tracking_id;
    this.tracking_customer.customer_tracking.customer_id = policy.user.id;
    this.tracking_customer.customer_tracking.policy_id = policy.id;
    this.tracking.customer_tracking = Array();
    let tracking = {
      page: 1,
      policy_id: policy.id
    };
    this.operatorsService
      .getAllCustomerTracking(tracking)
      .subscribe((data: any) => {
        console.log(data);
        this.tracking.customer_tracking = data.customer_trackings;
        console.log(this.tracking.customer_tracking);
      });
  }
  changeDepartment(event: any) {
    let index = event.target.options.selectedIndex;
    console.log(index);
    this.tracking_options.area = this.tracking_options.areas[index];
    console.log(this.tracking_options.area);
  }
  changeRadio() {
    this.tracking.future_call = !this.tracking.future_call;
    console.log(this.tracking.future_call);
    this.tracking.data = "";
    (this.tracking.time = ""),
      (this.tracking_customer.customer_tracking.tracking_close_reason_id = null);
    this.tracking_customer.close_tracking = !this.tracking.future_call;
    console.log("cerrar", this.tracking_customer.close_tracking);
  }

  createTrackingCustomer() {
    this.tracking_customer.tracking_call.scheduled_call_date =
      this.tracking.date + "T" + this.tracking.time;
      
    if (this.tracking.type == 1 && !this.tracking.future_call) {
      console.log(this.tracking_customer);
      this.operatorsService.createCustomerTracking(this.tracking_customer).subscribe(
        (data: any) => {
          console.log(data);
          if (data.result) {
            swal(data.msg, "", "success");
            $("#modalSeguimiento").modal("hide");
            this.getPolicies();
          }
      });
    }
    if (this.tracking.type == 1 && this.tracking.future_call) {
      let new_call = {
        tracking_call: {
          call_topic_id: this.tracking_customer.tracking_call.call_topic_id,
          call_type_id: this.tracking_customer.tracking_call.call_type_id,
          assigned_user_id: this.tracking_customer.tracking_call
            .assigned_user_id,
          scheduled_call_date: this.tracking_customer.tracking_call
            .scheduled_call_date,
          call_result_id: null,
          note: ""
        }
      };
      this.tracking_customer.tracking_call.scheduled_call_date = "";
      this.tracking_customer.tracking_call.assigned_user_id = this.seller.id;
      console.log(this.tracking_customer)

      this.operatorsService.createCustomerTracking(this.tracking_customer).subscribe(
        (data: any) => {
          console.log(data);
          if (data.result) {
            this.operatorsService
              .createTrackingCall(data.customer_tracking.id, new_call)
              .subscribe((data2: any) => {
                console.log(data2);
                if (data2.result) {
                  $("#modalSeguimiento").modal("hide");
                  this.getPolicies();
                  swal("Llamada registrada correctamente", "", "success");
                } else swal(data2.msg, "", "error");
              });
          }
        });
    }
    if (this.tracking.type == 2) {
      console.log("2");
      let call_made: any;
      if (!this.tracking.future_call) {
        call_made = {
          tracking_call: {
            call_result_id: this.tracking_customer.tracking_call.call_result_id,
            note: this.tracking_customer.tracking_call.note
          },
          close_tracking: this.tracking_customer.close_tracking,
          customer_tracking: {
            tracking_close_reason_id: this.tracking_customer.customer_tracking
              .tracking_close_reason_id,
            comment: this.tracking_customer.customer_tracking.coment
          }
        };
      } else {
        console.log("hola")
        call_made = { 
          tracking_call: {
            call_result_id: this.tracking_customer.tracking_call.call_result_id,
            note: this.tracking_customer.tracking_call.note
          }
        }
      }

      this.operatorsService
        .createTrackingCallMade(this.tracking.id, call_made)
        .subscribe((data: any) => {
          console.log(data);
          if (data.result) {
            if (this.tracking.future_call) {
              let new_call = {
                tracking_call: {
                  call_topic_id: this.tracking_customer.tracking_call
                    .call_topic_id,
                  call_type_id: this.tracking_customer.tracking_call
                    .call_type_id,
                  assigned_user_id: this.tracking_customer.tracking_call
                    .assigned_user_id,
                  scheduled_call_date: this.tracking_customer.tracking_call
                    .scheduled_call_date,
                  call_result_id: null,
                  note: ""
                }
              };

              this.operatorsService
                .createTrackingCall(this.tracking.id, new_call)
                .subscribe((data: any) => {
                  console.log(data);
                  if (data.result) {
                    $("#modalSeguimiento").modal("hide");
                    swal("Llamada registrada correctamente", "", "success");
                    this.getPolicies();
                  } else swal(data.msg, "", "error");
                });
            } else {
              $("#modalSeguimiento").modal("hide");
              this.getPolicies();
              swal("Seguimiento cerrado correctamente", "", "success");
            }
          }
        });
    }
  }

  cleanForm(){
    this.tracking_customer = {
      customer_tracking: {
        customer_id: 0,
        policy_id: 0,
        tracking_department_id: null,
        coment: ""
      },
      tracking_call: {
        call_topic_id: null,
        call_type_id: null,
        assigned_user_id: null,
        scheduled_call_date: "",
        call_result_id: null,
        note: ""
      },
      close_tracking: true
    };
  }

  //HUBSPOT
  updateHubspot() {
    let hubspot = Array();

    hubspot.push({
      property: "hubspot_owner_id",
      value: this.policy_assign_seller.hubspot_id
    });
    let form = {
      properties: hubspot,
      access_token: localStorage.getItem("access_token"),
      vid: localStorage.getItem("vid")
    };
    this.hubspotService.updateContactVid(form).subscribe((data: any) => {
      console.log(data);
    });
  }

  validateAccessToken() {
    this.hubspotService
      .validateToken(localStorage.getItem("access_token"))
      .subscribe((data: any) => {
        console.log(data);
        if (data.status == "error") {
          this.hubspotService.refreshToken().subscribe((data: any) => {
            localStorage.setItem("access_token", data.access_token);
            this.getContactHubspot();
          });
        } else this.getContactHubspot();
      });
  }
  getContactHubspot() {
    this.hubspotService
      .getContactByEmail(
        this.policy_assign_seller.email,
        localStorage.getItem("access_token")
      )
      .subscribe((data: any) => {
        console.log(data);
        localStorage.setItem("vid", data.vid);
        this.updateHubspot();
      });
  }
}
