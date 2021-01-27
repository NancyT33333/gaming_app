using CustomerService from '../../srv/cat-service';

////////////////////////////////////////////////////////////////////////////
//
//	Games Object Page
//
annotate CustomerService.Games with @(
	UI: {
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>General}', Target: '@UI.FieldGroup#General'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Details}', Target: '@UI.FieldGroup#Details'},

		],
		FieldGroup#General: {
			Data: [
				{Value: name},
				{Value: publisher_ID},
				{Value: description},
			]
		},
		FieldGroup#Details: {
			Data: [				
				{Value: price},
                {Value: image, Label:'{i18n>Image}'},         
                {Value: rating, Label:'{i18n>Rating}'},
                {Value: publisher.name, Label:'{i18n>Publisher}'}	
			]
		}
	
	}
);
