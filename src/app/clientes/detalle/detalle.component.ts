import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})

export class DetalleComponent implements OnInit{
  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSelecionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService, 
    public modalService : ModalService,
    public authService : AuthService){}

  ngOnInit(): void {
  }

  seleccionarFoto(event){
    this.fotoSelecionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSelecionada);
    if(this.fotoSelecionada.type.indexOf('image') < 0){
      Swal.fire('Error seleccionar imagen:', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSelecionada = null;
    } 
  }

  subirFoto(){
    if(!this.fotoSelecionada){
      Swal.fire('Error upload:', 'Debe seleccionar una foto', 'error');

    } else{
      this.clienteService.subirFoto(this.fotoSelecionada, this.cliente.id)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round(100 * event.loaded / event.total);
        }else if(event.type === HttpEventType.Response){
          let response:any = event.body;
          this.cliente = response.cliente as Cliente; 

          this.modalService.notificarUpload.emit(this.cliente);
          Swal.fire('Listo', response.mensaje, 'success');
        }
      })
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSelecionada = null;
    this.progreso = 0;
  }
}
