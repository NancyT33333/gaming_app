using { teamidea.study as my } from '../db/schema';

service AdminService @(_requires:'authenticated-user') {
  entity Games as projection on my.Games;
  entity Publishers as projection on my.Publishers;
}
