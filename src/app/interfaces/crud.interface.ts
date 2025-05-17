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
	/**
	 * Show the value as a badge
	 * Possible values: true, false
	*/
	showAsBadge?: boolean;
	
	/**
	 * Background color class for badges
	 * Possible values: bg-yellow-50, bg-red-50, bg-green-50, bg-blue-50, bg-purple-50, bg-pink-50
	*/
	badgeBgClass?: string;
	isRelation?: boolean;
	isArray?: boolean;
	relationName?: any;
	relationDisplayName?: any;
	relationValue?: any;
	

	search?: {
		placeholder: string;
		type?: string;
		options?: {
			name: string;
			valueName: string;
			displayField: string;
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