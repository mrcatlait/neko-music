provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_pages_project" "website_pages_project" {
  account_id        =  var.cloudflare_account_id
  name              = "website"
  production_branch = "master"
}

resource "cloudflare_pages_domain" "website_domain" {
  account_id    = var.cloudflare_account_id
  project_name  = cloudflare_pages_project.website_pages_project.name
  name          = var.cloudflare_domain_name
}

resource "cloudflare_record" "website_record" {
  zone_id         = var.cloudflare_zone_id
  name            = cloudflare_pages_domain.website_domain.domain
  value           = cloudflare_pages_project.website_domain.subdomain
  type            = "CNAME"
  proxied         = true
  ttl             = 1
  allow_overwrite = true
}
