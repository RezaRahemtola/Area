import { MigrationInterface, QueryRunner } from "typeorm";
import { ServiceName } from "../services.service";

export class UpdateServiceImagesToBrandFetchSVGs1698161840408 implements MigrationInterface {
	private readonly images: Partial<Record<ServiceName, Record<"lastUrl" | "newUrl", string>>> = {
		github: {
			newUrl: "https://asset.brandfetch.io/idZAyF9rlg/id6a3YYV60.svg",
			lastUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
		},
		google: {
			newUrl: "https://asset.brandfetch.io/id6O2oGzv-/idvNIQR3p7.svg",
			lastUrl:
				"https://lh3.googleusercontent.com/0cDOOJjp8pUGDDFLqHFITEi35uMGZ5wHpZ9KTKridxk71kpR9MfeydpQqG5n8Mvetvkg5iVuZGeL2xMvxgBY_UL-T9p0x_Eo4EAh",
		},
		twitter: {
			newUrl: "https://asset.brandfetch.io/idS5WhqBbM/id-opmlNbH.svg",
			lastUrl:
				"https://cdn.cms-twdigitalassets.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.2560.png",
		},
		linkedin: {
			newUrl: "https://asset.brandfetch.io/idJFz6sAsl/id18wpWxxf.svg",
			lastUrl:
				"https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg",
		},
		microsoft: {
			newUrl: "https://asset.brandfetch.io/idchmboHEZ/iduap5ndHF.svg",
			lastUrl:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png?20210729021049",
		},
		facebook: {
			newUrl: "https://asset.brandfetch.io/idpKX136kp/id4P3q9qSr.svg",
			lastUrl: "https://fr.m.wikipedia.org/wiki/Fichier:Facebook_f_logo_%282019%29.svg",
		},
		miro: {
			newUrl: "https://asset.brandfetch.io/idAnDTFapY/idG4aRyg5R.svg",
			lastUrl: "https://brandfetch.com/miro.com/library/default/asset/id1rEl70oX?collection=logos&view=overview",
		},
	} as const;

	public async up(queryRunner: QueryRunner): Promise<void> {
		await Promise.all(
			Object.entries(this.images).map(async ([service, { newUrl }]) => {
				await queryRunner.query(
					`UPDATE service
           SET image_url = '${newUrl}'
           WHERE id = '${service}'`,
				);
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await Promise.all(
			Object.entries(this.images).map(async ([service, { lastUrl }]) => {
				await queryRunner.query(
					`UPDATE service
           SET image_url = '${lastUrl}'
           WHERE id = '${service}'`,
				);
			}),
		);
	}
}
