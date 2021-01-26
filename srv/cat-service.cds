using { teamidea.study as my } from '../db/schema';

@path:'/browse'

service CatalogService @(_requires:'authenticated-user') {
  @readonly entity Games as SELECT from my.Games {* } 
};  

