export class Empresa {

    constructor(id: number, nombre: string, direccion: string, telefono: string, mail: string, facebook: string, instagram: string, twitter: string, logo: string) {

        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.mail = mail;
        this.facebook = facebook;
        this.instagram = instagram;
        this.twitter = twitter;
        this.logo = logo;

    }

    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    mail: string;
    facebook: string;
    instagram: string;
    twitter: string;
    facebook_link: string;
    instagram_link: string;
    twitter_link: string;
    logo: string;

}