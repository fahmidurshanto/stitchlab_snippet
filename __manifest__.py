{
    "name": "StitchLab Website Snippets",
    "version": "17.0.1.0.0",
    "category": "Website",
    "summary": "Reusable StitchLab landing page snippets for Odoo Website Builder",
    "depends": ["website"],
    "data": [
        "views/snippets/stitchlab_snippets.xml",
        "views/snippets/snippets.xml",
    ],
    "assets": {
        "web.assets_frontend": [
            "stitchlab_snippets/static/src/scss/stitchlab_snippets.scss",
            "stitchlab_snippets/static/src/js/stitchlab_snippets.js",
        ],
    },
    "installable": True,
    "application": False,
    "license": "LGPL-3",
}
