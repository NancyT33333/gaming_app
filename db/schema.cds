namespace teamidea.study;

entity Games : {
  key ID : Integer;
  name  :  String(111);
  description  :  String(1111);
  publisher : Association to Publishers;
  image  : String;
  price  : Decimal(9,2);   
}

entity Publishers :  {
  key ID : Integer;
  name   : String(111);  
  games  : Association to many Games on games.publisher = $self;  
}