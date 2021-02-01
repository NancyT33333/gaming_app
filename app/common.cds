/*
  Common Annotations shared by all apps
*/

using { teamidea.study as my } from '../db/schema';


////////////////////////////////////////////////////////////////////////////
//
//	Games Lists
//
annotate my.Games with @(
	UI: {
		Identification: [{Value: ID}],
	    SelectionFields: [  publisher_ID ],
		LineItem: [
            {Value: image, Label:'{i18n>Image}'},
			{Value: ID},
			{Value: name},
            {Value: rating, Label:'{i18n>Rating}'},
			{Value: publisher.name, Label:'{i18n>Publisher}'},			
			{Value: price}			
		],
        FieldGroup #GeneralInformation : {
            $Type : 'UI.FieldGroupType',
            Data : [
                {
                    $Type : 'UI.DataField',
                    Value : rating,
                },
            ],
        },
     
	}  
    
) {
	publisher @ValueList.entity:'Publishers';
};

annotate my.Publishers with @(
	UI: {
		Identification: [{Value:ID}],
        LineItem: [
            {Value: name, Label:'{i18n>Publisher}'},
			{Value: games},
					
		]
        
	}
);


////////////////////////////////////////////////////////////////////////////
//
//	Games Details
//
annotate my.Games with @(
	UI: {
  	HeaderInfo: {
  		TypeName: '{i18n>Game}',
  		TypeNamePlural: '{i18n>Games}',
  		Name: {Value: name},
  		Description: {Value: publisher.name}
  	},
	}
);



////////////////////////////////////////////////////////////////////////////
//
//	Games Elements
//
annotate my.Games with {
	ID @title:'{i18n>ID}' @UI.HiddenFilter;
	name @title:'{i18n>Name}';
	publisher @title:'{i18n>PublisherID}';
	price @title:'{i18n>Price}';	
	description @UI.MultiLineText;
    image  @( Common.Label: 'Image',  UI.IsImageURL: true);
}


////////////////////////////////////////////////////////////////////////////
//
//	Publishers Elements
//
annotate my.Publishers with {
	ID @title:'{i18n>ID}' @UI.HiddenFilter;
	name @title:'{i18n>PublisherName}';
}
