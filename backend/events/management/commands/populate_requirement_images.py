from django.core.management.base import BaseCommand
from events.models import RequirementImage

class Command(BaseCommand):
    help = 'Populate requirement images from image URLs'

    def handle(self, *args, **options):
        # Clear existing images
        RequirementImage.objects.all().delete()
        
        # Social Events requirement images
        social_images = [
            # Wedding
            ('bridal_photography', 'https://th.bing.com/th/id/OIP.FaiNemHexEFGoZPyeJ7BIQHaJQ?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('bridal_photography', 'https://th.bing.com/th/id/OIP.eVkyEiWFQcfYl6aYQobnmQHaHa?w=208&h=208&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('bridal_photography', 'https://th.bing.com/th/id/OIP.J1eNpy90VcnydePVW6dLLAHaLG?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('couple_photography', 'https://th.bing.com/th/id/OIP.sHjHAKufcrINdQirP6w3wgHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('couple_photography', 'https://th.bing.com/th/id/OIP.E3eT4E7soy5ZiayQfBOoxwHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('couple_photography', 'https://th.bing.com/th/id/OIP.ubjKJs0GjKJncV4D-zTZSgHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('family_photography', 'https://th.bing.com/th/id/OIP.z0mvlkLv6IvBC5qzqJXNOgHaE8?w=257&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('family_photography', 'https://th.bing.com/th/id/OIP.S9qu_FIQt3m13zYddk7ywQHaE8?w=298&h=199&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('family_photography', 'https://th.bing.com/th/id/OIP.nlQUAvYH7go2lCRR6GOlMQHaF7?w=245&h=196&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('candid_photography', 'https://th.bing.com/th/id/OIP.K2rScqMWifdBPh_RBB4QmgHaE8?w=247&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('candid_photography', 'https://th.bing.com/th/id/OIP.4x1kg6GXBv2Mq6ZpWFYBAwHaFO?w=237&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('candid_photography', 'https://th.bing.com/th/id/OIP.FkMbHCVtkvASwuViBsst8gHaE8?w=270&h=185&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('reception_photography', 'https://th.bing.com/th/id/OIP.xS7dqL3UxmZh8eJN3TbJdgHaE7?w=279&h=186&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('reception_photography', 'https://th.bing.com/th/id/OIP.f7hC0UVv_I_AMsVaTEh4ngHaEf?w=308&h=186&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('reception_photography', 'https://th.bing.com/th/id/OIP.aMzT_83VvM0XLfegeUj7vwHaE8?w=299&h=199&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('mehendi_photography', 'https://th.bing.com/th/id/OIP.vQOMGuKaLImULupnSTZiGAHaJO?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('mehendi_photography', 'https://th.bing.com/th/id/OIP.vQOMGuKaLImULupnSTZiGAHaJO?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('mehendi_photography', 'https://th.bing.com/th/id/OIP.Wf1aadW5K7JqO88xuU5roQHaJN?w=208&h=258&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('traditional_portraits', 'https://th.bing.com/th/id/OIP.1oyu-c4mFnVfXh5J2EU2mgHaE8?w=294&h=196&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('traditional_portraits', 'https://th.bing.com/th/id/OIP.0-vnqUsdIaynEdQiXjMEeAHaFW?w=273&h=196&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('traditional_portraits', 'https://th.bing.com/th/id/OIP.MXD5JcYxNwxLsTOKgo2wPQHaE8?w=273&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('wedding_album_design', 'https://th.bing.com/th/id/OIP.TYBqcABt6__FNnN_hrqH4AHaF7?w=216&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('wedding_album_design', 'https://th.bing.com/th/id/OIP.tGbfeQeSdRyH7-h56tanrwHaE8?w=258&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('wedding_album_design', 'https://th.bing.com/th/id/OIP.RH0gwOfo1YEGUeYWOt56lAHaFH?w=235&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('mandap_decoration', 'https://th.bing.com/th/id/OIP.bmD21QvgXpnrfK4rW-9BRwHaF9?w=203&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('mandap_decoration', 'https://th.bing.com/th/id/OIP.vw6CjJCRAFv4fFY23hMPaAHaGD?w=224&h=183&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('mandap_decoration', 'https://th.bing.com/th/id/OIP.FZw9CzqGZ5XW3SG4qJE4XAHaDt?w=310&h=175&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('floral_decoration', 'https://th.bing.com/th/id/OIP.1nGcva-I7SWCgMw0Za4x6AHaJM?w=208&h=259&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('floral_decoration', 'https://cdn0.weddingwire.in/articles/images/7/3/8/2/img_12837/wedding-flower-decoration-lin-and-jirsa-photography-seal-it-with-a-stunning-canopy-style-ceiling.jpg', 1),
            ('floral_decoration', 'https://wedjoin.com/wp-content/uploads/2020/01/decorate-wedding-mandap-flowers-beautiful-flower-decoration-ideas-wedding-day-1.jpg', 2),
            ('wedding_cake', 'https://th.bing.com/th/id/OIP.p7hmBzSLjjTFFWifFrM9TQHaJQ?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('wedding_cake', 'https://th.bing.com/th/id/OIP.bDxP8Ds3xo2hLl1yBZ7R2gHaJ4?w=208&h=278&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('wedding_cake', 'https://th.bing.com/th/id/OIP.EouS3ggEgR1e9FCj8kfeCAHaLQ?w=202&h=308&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            
            # Birthday
            ('balloon_decoration', 'https://th.bing.com/th/id/OIP.CI7B_8LMRKW_F5f3CR_lfQHaIB?w=182&h=197&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('balloon_decoration', 'https://th.bing.com/th/id/OIP.Js8nhnJArIVIQ9kOl3NTqQAAAA?w=164&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('balloon_decoration', 'https://th.bing.com/th/id/OIP._9sWV1AilU94XwEtbPmawgHaHa?w=164&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('theme_decoration', 'https://th.bing.com/th/id/OIP.sL8dNt5lfYZ_43e3VVoJMgHaHa?w=199&h=200&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('theme_decoration', 'https://i.pinimg.com/736x/43/2b/d7/432bd71bb58591b9e0c9fdb3f887d61b.jpg', 1),
            ('theme_decoration', 'https://m.media-amazon.com/images/I/81GFzZZ57rL._AC_SL1500_.jpg', 2),
            ('event_photography', 'https://th.bing.com/th/id/OIP.QzgQEAzqNzLma0Eoggcw0QHaE8?w=273&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('event_photography', 'https://th.bing.com/th/id/OIP.MUmKuDvJiLFgvamXhA6mfgHaE8?w=273&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('event_photography', 'https://th.bing.com/th/id/OIP.MUmKuDvJiLFgvamXhA6mfgHaE8?w=273&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('birthday_cake', 'https://th.bing.com/th/id/OIP._aIeu_633QanVAe9pgdaIgHaMA?w=208&h=314&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('birthday_cake', 'https://th.bing.com/th/id/OIP.ocSBAq0QxX_nL-aSn3Q1QQHaJQ?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('birthday_cake', 'https://th.bing.com/th/id/OIP.J96rcY0GJUH7bg6UpMcmNQHaHH?w=208&h=201&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            
            # Engagement
            ('engagement_photography', 'https://th.bing.com/th/id/OIP.2c-3PKrxxkhDt--_ek18jAHaE8?w=228&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('engagement_photography', 'https://th.bing.com/th/id/OIP.l7CjDQdLzk8LpkPhvVQNhQHaE6?w=230&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('engagement_photography', 'https://th.bing.com/th/id/OIP.oDDtLOdPnMiROyNAznaChgHaE8?w=233&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('engagement_candid_photography', 'https://th.bing.com/th/id/OIP.M1R3kltQWqIJCdna2Rv_WwHaJ4?w=208&h=277&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('engagement_candid_photography', 'https://th.bing.com/th/id/OIP.qffPfPf6povZlj5vR1BxMgHaLd?w=201&h=310&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('engagement_candid_photography', 'https://th.bing.com/th/id/OIP.b7E_kEJxRyaG_L2iSR6pUwHaHa?w=208&h=208&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('event_decoration', 'https://th.bing.com/th/id/OIP.rS01fjCy21bShS1xMNqjxQHaIB?w=146&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('event_decoration', 'https://th.bing.com/th/id/OIP.rS01fjCy21bShS1xMNqjxQHaIB?w=146&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('event_decoration', 'https://th.bing.com/th/id/OIP.b_dbI5R-EGANciuPQd0YxwHaHa?w=121&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('floral_arrangements', 'https://tse2.mm.bing.net/th/id/OIP.mIUSjhFQ_AbzlboDXKP1WQHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3', 0),
            ('floral_arrangements', 'https://images.squarespace-cdn.com/content/v1/5be9a698697a98a5f9beacbd/1691756710228-EKH8ZNYM2546JRTIN5Y3/Photo+Nov+16+2022%2C+6+53+47+PM-min.jpg?format=1500w', 1),
            ('floral_arrangements', 'https://tse2.mm.bing.net/th/id/OIP.wHW7Tcmk4UwecgB4ORoH2wHaFj?cb=12&w=1000&h=750&rs=1&pid=ImgDetMain&o=7&rm=3', 2),
            
            # Anniversary
            ('anniversary_photography', 'https://th.bing.com/th/id/OIP.d-vS6upR15vcJpPM6uPf2wHaEG?w=298&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('anniversary_photography', 'https://th.bing.com/th/id/OIP.e2OeXk7CNYSe_vXKoPT97wHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('anniversary_photography', 'https://th.bing.com/th/id/OIP.Wx9pyBZSE07kC5YoKwiTCwHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('anniversary_cake', 'https://th.bing.com/th/id/OIP.IZDxOnro839_Wq4qu2fO8wHaHa?w=204&h=204&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('anniversary_cake', 'https://th.bing.com/th/id/OIP.nceVugWMB0yGjI8z4HlA6AHaHa?w=204&h=204&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('anniversary_cake', 'https://th.bing.com/th/id/OIP.iuu4Olfh7sTtiGc61f2ggAHaHa?w=204&h=204&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            
            # Baby Shower
            ('baby_themed_decoration', 'https://th.bing.com/th/id/OIP.YcXXjcJhsx7ktgirRCTy2gAAAA?w=146&h=194&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('baby_themed_decoration', 'https://th.bing.com/th/id/OIP.NaRBnfhrZqqUbktNDlM-zgHaHa?w=185&h=185&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('baby_themed_decoration', 'https://th.bing.com/th/id/OIP.l4cNtkjTBdUARb654yP6sAHaHa?w=185&h=185&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('baby_shower_cake', 'https://th.bing.com/th/id/OIP.lk65PA3UysewSjvF-mSVSAAAAA?w=208&h=347&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('baby_shower_cake', 'https://th.bing.com/th/id/OIP.kuXnWlBWGvj4XLCvBcUmbQHaHa?w=208&h=208&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('baby_shower_cake', 'https://th.bing.com/th/id/OIP.m1rx4OWotivvDi1q5x6v2QAAAA?w=208&h=314&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            
            # Pre-Wedding Shoot
            ('pre_wedding_photography', 'https://th.bing.com/th/id/OIP.zqgirXXCp75yPDLBYzwJUAHaE-?w=292&h=195&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('pre_wedding_photography', 'https://th.bing.com/th/id/OIP.uPJVeOS_LT2WI_IlDhlg6wHaE7?w=293&h=195&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('pre_wedding_decoration', 'https://saidecorationevents.in/wp-content/uploads/2023/04/IMG-20210915-WA0060-684x1024.jpg', 0),
            ('pre_wedding_decoration', 'https://saidecorationevents.in/wp-content/uploads/2023/05/IMG-20210915-WA0057.jpg', 1),
            ('pre_wedding_decoration', 'https://images.shaadisaga.com/shaadisaga_production/photos/pictures/000/927/783/new_large/smiti_mittal.jpg?1561013889', 2),
            
            # Gender Reveal Party
            ('gender_reveal_setup', 'https://th.bing.com/th/id/OIP.eFX9ulSOxyS6lw1oPJQHsgHaGE?w=208&h=171&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('gender_reveal_setup', 'https://th.bing.com/th/id/OIP.QKwsVRY53eTNdJhWlNimHwHaM9?w=188&h=330&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('gender_reveal_setup', 'https://th.bing.com/th/id/OIP.IcNw8A3JzXbijhws7h0RcwHaFj?w=208&h=156&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('reveal_photography', 'https://th.bing.com/th/id/OIP.U4zI6wEMofXbhE2l3glxWQHaLG?w=204&h=305&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('reveal_photography', 'https://th.bing.com/th/id/OIP.hjmMCtiUYbbDkzTC3fpR0wHaFS?w=208&h=149&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('reveal_photography', 'https://th.bing.com/th/id/OIP.gzWy5yaLq-QFMQyv7d-W6QHaJQ?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            
            # All Party Types
            ('party_decoration', 'https://th.bing.com/th/id/OIP.97tSLKDHK52LCw1LX8IM7gHaJ4?w=147&h=197&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('party_decoration', 'https://th.bing.com/th/id/OIP.v5nkXHeFHbFR8aGGthXbcwHaE8?w=292&h=195&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('party_decoration', 'https://th.bing.com/th/id/OIP.Sw6Z3YiBbuRyCA0s13WlHQHaE8?w=302&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
            ('themed_decoration', 'https://th.bing.com/th/id/OIP.bx7WpI_Qjri_LAfVci0kzQHaGw?w=193&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('themed_decoration', 'https://th.bing.com/th/id/OIP.7_R_xrFSu__diWroFVv9ywHaHa?w=249&h=188&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('photography_services', 'https://th.bing.com/th/id/OIP.DXBb_hDZgv2aCmOV6NxS0QHaE7?w=268&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 0),
            ('photography_services', 'https://th.bing.com/th/id/OIP.XWSr16G_RKsX0vpb15zCUgHaE8?w=268&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 1),
            ('photography_services', 'https://th.bing.com/th/id/OIP.Wjl9sq_UeSIE57T0i-H3fwHaE3?w=234&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3', 2),
        ]
        
        # Create RequirementImage objects
        for requirement_id, image_url, order in social_images:
            RequirementImage.objects.create(
                requirement_id=requirement_id,
                image_url=image_url,
                order=order
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully populated {len(social_images)} requirement images for social events')
        )