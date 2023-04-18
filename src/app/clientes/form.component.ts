import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router , ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public titulo: string ="Crear Cliente";
  public errores: string[];
  public regiones: Region[];

  constructor(private clienteService : ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute){ }

  ngOnInit(): void {
    this.cargarFormulario()
  }

  cargarFormulario(): void{
      this.activatedRoute.params.subscribe(params => {
        let id = params['id']
        if (id){
          this.clienteService.getCliente(id).subscribe(
            (cliente) => this.cliente = cliente
          )
        }
      })
      this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }


  //Aca creamos el cliente luego de hacer submit en el formulario y redirigimos a la ruta '/clientes' para mostrar nuevamente el listado de clientes, 
  //con el cliente ya creado
  create(): void{
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente guardado',
        `${response.mensaje}: ${response.cliente.nombre} ${response.cliente.apellido}`,
        'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend: '+ err.status);
        console.error(err.error.errors);

      }
    )
  }

  update():void{
    console.log(this.cliente);
    this.clienteService.update(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente actualizado',
        `${response.mensaje}: ${response.cliente.nombre} ${response.cliente.apellido}`)
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend: '+ err.status);
        console.error(err.error.errors);

      }
    )
  }

  compararRegion(o1:Region, o2:Region):boolean{
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined? false: o1.id===o2.id;
  }

}