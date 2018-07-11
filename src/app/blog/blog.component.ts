import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
	post_url:any      = "";
	categoria: any = "";
	posts: any = Array();
	constructor(private router : ActivatedRoute,private router2 : Router) {
  	}

	ngOnInit() {
		this.get_post();
	}

	get_post(){
		this.posts = [
			{
				id: 1,
				category: "Tecnología",
				date: "Julio 2018",
				title: "Con SXKM saca tu seguro de la guantera y llévalo contigo a todas partes.",
				content: '',
				image: "sxkm-ofrece-cobertura-amplia-en-toda-la-republica-mexicana.jpg",
				tags:[ 
					{ tag: "INSURTECH" },
					{ tag: "PAYD" },
					{ tag: "PIA"}
				],
				url_category: "tecnologia",
				url_post: "con-sxkm-saca-tu-seguro-de-la-guantera-y-llevalo-contigo-a-todas-partes"
			}
		]
	}

}
