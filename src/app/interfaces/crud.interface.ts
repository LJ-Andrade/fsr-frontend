export interface ListData {
	name: string;
	text: string;
	unDeleteableIds?: number[];
	unEditableIds?: number[];

	valueClass?: string;
	image?: boolean;
	mutate?: (data: any) => string;
	hidden?: boolean;
	hideOnList?: boolean;
	hideOnCreation?: boolean;
	hideOnEdition?: boolean;
	columnClass?: string;

	isArray?: boolean;
	showAsBadge?: boolean;
	relation?: boolean;
	relationName?: any;
	relationFieldName?: any;

	search?: {
		placeholder: string;
		type?: string;
		options?: {
			name: string;
			valueName: string;
			data: any[];
		}
	}

	// manyRelations?: boolean;
	// selectedRows?: boolean;
	// hideOnShow?: boolean;
	// fieldType?: string;
	// relationFields?: ListData[];
	// limitText?: number;
}

export interface ListConfig {
	unDeleteableIds: number[];
	unEditableIds: number[];
}

export interface SectionConfig {
	model: string;
	icon: string;
	nameSingular: string;
	namePlural: string;
	formSize: 'SMALL' | 'MEDIUM' | 'LARGE'
}