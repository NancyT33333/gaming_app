using { teamidea.study as my } from '../db/schema';

@path:'/browse'

service CustomerService @(requires:'customer') {
  @readonly entity Games as SELECT from my.Games {* } ;
  @readonly entity Publishers as projection on my.Publishers;
};  

