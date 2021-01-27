namespace teamidea.study;

using {   cuid } from '@sap/cds/common';

entity Games : cuid {
  key ID : Integer;
  name  :  String(111);
  description  :  String(1111);
  rating: Decimal(9,2);
  publisher : Association to Publishers;
  image  : String;
  price  : Decimal(9,2);   
}

entity Publishers : cuid {
  key ID : Integer;
  name   : String(111);  
  games  : Association to many Games on games.publisher = $self;  
}