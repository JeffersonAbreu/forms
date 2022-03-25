import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { EstadoBr } from '../shared/models/estado-br';
import { DropdownService } from '../shared/services/dropdown.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
export class DataFormComponent implements OnInit {
  public formulario: FormGroup = new FormGroup({});
  private estados: EstadoBr[] = [];

  constructor(
    private formBuilder: FormBuilder,
    // private cepService: ConsultaCepService,
    private http: HttpClient,
    private dropdownService: DropdownService
  ) { }

  ngOnInit(): void {
    this.dropdownService.getEstadosBr()
      .subscribe((dados: any) => this.estados = dados);
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null)
    // });]
    this.formulario = this.formBuilder.group({
      nome: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(35),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      }),
    });
  }
  onSubmit() {
    // console.log(this.formulario.value);
    this.http
      .post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .subscribe(
        (dados) => {
          console.log(dados);
          // reseta o form
          // resetar();
        },
        (erro: any) => alert('Erro')
      );
  }
  resetar() {
    this.formulario.reset();
  }

  verificaValidTouched(campo: string): boolean {
    if (this.formulario == null) return false;
    let imput = this.formulario.get(campo);
    if (imput == null) return false;
    return !imput.valid && imput.touched;
  }

  aplicaCssErro(campo: string): any {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo),
    };
  }

  consultaCEP(): void {
    const cep: string = this.formulario.get('endereco.cep')?.value;

    if (cep != null && cep !== '') {
      // this.cepService.consultaCEP(cep)
      // .subscribe(dados => this.populaDadosForm(dados));
    }
  }

  populaDadosForm(dados: any) {
    // this.formulario.setValue({});

    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        // cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });

    this.formulario.get('nome')?.setValue('Jeff');
  }

  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
      },
    });
  }
}
