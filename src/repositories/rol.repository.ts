import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyThroughRepositoryFactory, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Permiso, PermisoRol, Rol, RolRelations, Usuario} from '../models';
import {PermisoRolRepository} from './permiso-rol.repository';
import {PermisoRepository} from './permiso.repository';
import {UsuarioRepository} from './usuario.repository';

export class RolRepository extends DefaultCrudRepository<
  Rol,
  typeof Rol.prototype._id,
  RolRelations
> {

  public readonly tiene_partidos: HasManyThroughRepositoryFactory<Permiso, typeof Permiso.prototype._id,
    PermisoRol,
    typeof Rol.prototype._id
  >;

  public readonly tiene_usuarios: HasManyRepositoryFactory<Usuario, typeof Rol.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('PermisoRolRepository') protected permisoRolRepositoryGetter: Getter<PermisoRolRepository>, @repository.getter('PermisoRepository') protected permisoRepositoryGetter: Getter<PermisoRepository>,
  ) {
    super(Rol, dataSource);
    this.tiene_usuarios = this.createHasManyRepositoryFactoryFor('tiene_usuarios', usuarioRepositoryGetter,);
    this.registerInclusionResolver('tiene_usuarios', this.tiene_usuarios.inclusionResolver);
    this.tiene_partidos = this.createHasManyThroughRepositoryFactoryFor('tiene_partidos', permisoRepositoryGetter, permisoRolRepositoryGetter,);
    this.registerInclusionResolver('tiene_partidos', this.tiene_partidos.inclusionResolver);
  }
}
