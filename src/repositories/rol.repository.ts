import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rol, RolRelations, Usuario, Permiso, PermisoRol} from '../models';
import {UsuarioRepository} from './usuario.repository';
import {PermisoRolRepository} from './permiso-rol.repository';
import {PermisoRepository} from './permiso.repository';

export class RolRepository extends DefaultCrudRepository<
  Rol,
  typeof Rol.prototype._id,
  RolRelations
> {

  public readonly tiene_varios: HasManyRepositoryFactory<Usuario, typeof Rol.prototype._id>;

  public readonly tiene_partidos: HasManyThroughRepositoryFactory<Permiso, typeof Permiso.prototype._id,
          PermisoRol,
          typeof Rol.prototype._id
        >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('PermisoRolRepository') protected permisoRolRepositoryGetter: Getter<PermisoRolRepository>, @repository.getter('PermisoRepository') protected permisoRepositoryGetter: Getter<PermisoRepository>,
  ) {
    super(Rol, dataSource);
    this.tiene_partidos = this.createHasManyThroughRepositoryFactoryFor('tiene_partidos', permisoRepositoryGetter, permisoRolRepositoryGetter,);
    this.registerInclusionResolver('tiene_partidos', this.tiene_partidos.inclusionResolver);
    this.tiene_varios = this.createHasManyRepositoryFactoryFor('tiene_varios', usuarioRepositoryGetter,);
    this.registerInclusionResolver('tiene_varios', this.tiene_varios.inclusionResolver);
  }
}
