/* eslint-disable */

export const AllTypesProps: Record<string,any> = {

}

export const ReturnTypes: Record<string,any> = {
	Query:{
		users:"User"
	},
	User:{
		id:"Int",
		username:"String",
		posts:"Post"
	},
	Post:{
		id:"Int",
		heading:"String",
		text:"String",
		authorId:"Int"
	}
}