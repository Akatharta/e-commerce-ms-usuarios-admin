import {Entity, hasMany, model, property} from '@loopback/repository';
import {PermisoRol} from './permiso-rol.model';
import {Permiso} from './permiso.model';
import {Usuario} from './usuario.model';

@model()
export class Rol extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @hasMany(() => Permiso, {through: {model: () => PermisoRol, keyFrom: 'id_rol', keyTo: 'id_permiso'}})
  tiene_partidos: Permiso[];

  @hasMany(() => Usuario, {keyTo: 'id_rol'})
  tiene_usuarios: Usuario[];

  constructor(data?: Partial<Rol>) {
    super(data);
  }
}

export interface RolRelations {
  // describe navigational properties here
}

export type RolWithRelations = Rol & RolRelations;
