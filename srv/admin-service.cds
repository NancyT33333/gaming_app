using { teamidea.study as my } from '../db/schema';

service AdminService @(requires:'administrator') {
  entity Games as projection on my.Games;
  entity Publishers as projection on my.Publishers;
}
