from django.core.management.base import BaseCommand
from events.models import EventRequirementImages

class Command(BaseCommand):
    help = 'Populate requirement images from images.txt file'

    def handle(self, *args, **options):
        # Clear existing images
        EventRequirementImages.objects.all().delete()
        
        # Image data from the file
        images_data = {
            'conference': {
                'led-screens': [
                    'https://th.bing.com/th/id/OIP.vnkv7aDEFVPm-0uSyy2MkAHaEK?w=296&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.XCfm2XYZOEao1_7m0XzPYQHaE8?w=234&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.gKuGHpmmEVZmcbZkdGd-4AHaFF?w=264&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'stage-design': [
                    'https://th.bing.com/th/id/OIP.a1oc6wF4STLx-4gfegFvaAHaEK?w=320&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.cMi9pEQfmo1hcz8JMWvEEwHaEK?w=300&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://i.pinimg.com/originals/16/03/a4/1603a468e0e35f8b646811a90c4d832a.jpg'
                ]
            },
            'seminar': {
                'event-photography': [
                    'https://www.dannysteynstudios.com/images/seminar-photographer-fort-lauderdale-florida/seminar-photographer-miami-florida-0004.jpg',
                    'https://www.languages.work/wp-content/uploads/2018/02/seminars.png',
                    'https://th.bing.com/th/id/OIP.eQil0kHPLJEJBBAo93tYOAHaEw?w=308&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'corporate-party': {
                'photo-booth': [
                    'https://www.luxebooth.com/wp-content/uploads/2023/08/Photo-Booth-Rental-For-Corporate-Event-in-Dallas.jpg',
                    'https://th.bing.com/th/id/OIP.Hf7l-QNAy3xaXaivy9ColQHaFj?w=246&h=184&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://tse4.mm.bing.net/th/id/OIP.wP7KaNpSBeGEjXkn1cBHNQHaFj?cb=12&pid=ImgDet&w=184&h=137&c=7&dpr=1.3&o=7&rm=3'
                ],
                'floral-arrangements': [
                    'https://tse2.mm.bing.net/th/id/OIP.mIUSjhFQ_AbzlboDXKP1WQHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
                    'https://images.squarespace-cdn.com/content/v1/5be9a698697a98a5f9beacbd/1691756710228-EKH8ZNYM2546JRTIN5Y3/Photo+Nov+16+2022%2C+6+53+47+PM-min.jpg?format=1500w',
                    'https://tse2.mm.bing.net/th/id/OIP.wHW7Tcmk4UwecgB4ORoH2wHaFj?cb=12&w=1000&h=750&rs=1&pid=ImgDetMain&o=7&rm=3'
                ],
                'lighting-design': [
                    'https://th.bing.com/th/id/OIP.pEG72aFXTf2y4rqQPv8GhwHaE7?w=267&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.pEG72aFXTf2y4rqQPv8GhwHaE7?w=267&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://cdn.encoreglobal.com/wp-content/uploads/sites/5/2020/08/25015527/lighting-auto-general.png'
                ]
            },
            'product-launch': {
                'product-photography': [
                    'https://tse4.mm.bing.net/th/id/OIP.zBIjM2p3s5695dcEb8ChdAHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
                    'https://wedesign.london/wp-content/uploads/2017/08/Urban-Retreat-Product-Photography-Water-Wide.jpg',
                    'https://th.bing.com/th/id/OIP.RxIShUCMhT2To6zGQdoAQgHaEK?w=236&h=150&c=6&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'event-videography': [
                    'https://th.bing.com/th/id/OIP.2yMlkV7G1I7CdWoTxLYziAHaHa?w=152&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.tLN2edeztADZNh18xIKfgAHaEI?w=309&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.xJ5jnWb1i6wuLw6HVOqKCwHaD4?w=332&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'stage-design': [
                    'https://th.bing.com/th/id/OIP.QlzR9eEVV1WTbzUM-CUY8gAAAA?w=328&h=184&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://s-media-cache-ak0.pinimg.com/736x/90/aa/90/90aa90f9b1ee1bb48e9836242acf7101--product-launch-stage-design.jpg',
                    'https://www.blueshadowgroup.com.au/images/design-product-launches-new.jpg'
                ]
            },
            'award-ceremony': {
                'stage-design': [
                    'https://th.bing.com/th/id/OIP.dhJUfUPIjnhwtxDf9J3FXQHaFS?w=215&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.kmeVsteb8g5vqMMEHUcitQHUcitQHaEK?w=261&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.JPpQq9aJLTICnIPNGnaD9QHaGD?w=243&h=198&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'ceremony-photography': [
                    'https://th.bing.com/th/id/OIP.tg0cfsvh3pZh9JbGSOFCkgHaEK?w=326&h=183&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.H7RfGb13ZoviVLfWOVvIIwHaE7?w=280&h=186&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.lB5sZV0n140KoppBOzRPTgHaEJ?w=330&h=186&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'award-engraving': [
                    'https://th.bing.com/th/id/OIP.zshEpuWhMSXJq_kV_SODJAHaEK?w=329&h=185&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.e-3e93X5GCJLsQsd7ar0DgHaHa?w=200&h=200&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.wRqQX6e8FB7VaQ6Lx9QzkQHaHa?w=219&h=219&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'trade-show': {
                'booth-design': [
                    'https://www.luxebooth.com/wp-content/uploads/2023/08/Photo-Booth-Rental-For-Corporate-Event-in-Dallas.jpg',
                    'https://th.bing.com/th/id/OIP.Hf7l-QNAy3xaXaivy9ColQHaFj?w=246&h=184&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://tse4.mm.bing.net/th/id/OIP.wP7KaNpSBeGEjXkn1cBHNQHaFj?cb=12&pid=ImgDet&w=184&h=137&c=7&dpr=1.3&o=7&rm=3'
                ],
                'display-systems': [
                    'https://th.bing.com/th?q=Trade+Show+Displays+with+LED+Lights&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&mw=247',
                    'https://th.bing.com/th/id/OIP.nZEu7pOn7w70_n-BdNciNwHaEK?w=291&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.antVmW3hXT_p4BJPXPIaoAHaE7?w=257&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'art-exhibition': {
                'artwork-display': [
                    'https://th.bing.com/th/id/OIP.m1ejGdMfkEWOmIFX3xQbnwHaFj?w=246&h=184&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://www.terraamericanart.org/wp-content/uploads/2022/01/The-Time-is-Now-1-scaled.jpg',
                    'https://www.artplacer.com/wp-content/uploads/2022/05/New-header-fairs-1-1-scaled.jpg'
                ],
                'gallery-lighting': [
                    'https://th.bing.com/th/id/OIP.Cw4Svrz8kXTY-02_ajlt_AHaHH?w=193&h=186&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://i.pinimg.com/736x/2b/77/71/2b7771c71b598beccd447bce76852ebc.jpg',
                    'https://i.pinimg.com/736x/2b/77/71/2b7771c71b598beccd447bce76852ebc.jpg'
                ]
            },
            'adoption-celebration': {
                'celebration-cake': [
                    'https://th.bing.com/th/id/OIP.OvLKgZTR28xiXIabpmzINQHaJ4?w=143&h=190&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.qR3QYj4J9jeIBMxEVPL-jgHaIA?w=176&h=189&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.qR3QYj4J9jeIBMxEVPL-jgHaIA?w=176&h=189&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'beach-party': {
                'beach-setup': [
                    'https://th.bing.com/th/id/OIP.Hnl7vfykod3AbWt-qwMtzwHaGC?w=199&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://i.pinimg.com/736x/9e/54/3f/9e543fe56b78828cef57c4424457cdc6.jpg',
                    'https://i.pinimg.com/736x/9e/54/3f/9e543fe56b78828cef57c4424457cdc6.jpg'
                ]
            },
            'book-launch': {
                'book-display': [
                    'https://th.bing.com/th/id/OIP.hqGX3qfykGsWDBiSXd1iqAHaFj?w=228&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.j-AQkJBsGlWE4J-bHiuCfwHaHD?w=164&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.n2mIMkku7kn18dMjydnaAgHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'bridal-shower': {
                'bridal-decoration': [
                    'https://th.bing.com/th/id/OIP.3XRsl8U67WWZuSO69bEYgwHaHa?w=208&h=208&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://i.pinimg.com/originals/d7/a4/9b/d7a49beb145217d38a833fdb7d449606.jpg',
                    'https://i.pinimg.com/originals/67/97/4f/67974f02ace5f5e229e42c3f8fcd2528.jpg'
                ]
            },
            'career-expo': {
                'interview-booths': [
                    'https://th.bing.com/th/id/OIP.HFn8zUSxs_fOJt_Yso_UGAHaE7?w=279&h=186&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.YGoZXsHmwHatUL-z3sazAQHaGC?w=226&h=184&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.vsIRTEAQiCaQz3ywE1Wu2wHaHa?w=189&h=190&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'christmas-celebration': {
                'christmas-cake': [
                    'https://th.bing.com/th/id/OIP.DALYw1x0FSBydgzDLgMJdAAAAA?w=308&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://www.awesome11.com/wp-content/uploads/2016/11/Gingerbread-man-Christmas-cake.jpg',
                    'https://tse3.mm.bing.net/th/id/OIP.jVqC-_0QrzZOdbskqntvngHaHa?cb=12&w=1024&h=1024&rs=1&pid=ImgDetMain&o=7&rm=3'
                ],
                'christmas-tree-setup': [
                    'https://th.bing.com/th/id/OIP.jXR8Oipt6QUOnN3m5dZyrgHaE8?w=277&h=185&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://www.cloudsandconfetti.com/wp-content/uploads/2020/06/IMG_5146-scaled.jpg',
                    'https://i.pinimg.com/736x/39/d8/f2/39d8f2f1f0b4eca62778b04d71ed366c.jpg'
                ],
                'festive-lighting': [
                    'https://th.bing.com/th/id/OIP.HqRa9MKkPL3wnD_LyhfW-gHaE8?w=312&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://img.huffingtonpost.com/asset/5fe378ab2600005b05a4f70f.jpeg?cache=u6vD9AHuKu&ops=1778_1000',
                    'https://img.huffingtonpost.com/asset/5fe378ab2600005b05a4f70f.jpeg?cache=u6vD9AHuKu&ops=1778_1000'
                ]
            },
            'cocktail-party': {
                'bar-setup': [
                    'https://th.bing.com/th/id/OIP.1qMqyCZw6qSLvsxyq3z4MQHaE8?w=251&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://chicagobarstore.com/wp-content/uploads/2017/07/668-44-508-000-0_h1_1_1.jpg',
                    'https://i.pinimg.com/736x/86/49/48/8649484fccc2ba0b45d73349fe74644f--lobby-bar-work-stations.jpg'
                ]
            },
            'classical-music-concert': {
                'concert-hall-setup': [
                    'https://th.bing.com/th/id/OIP.iNVK2UoDKjuDrK6GSBeDqwHaE7?w=295&h=197&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.iNVK2UoDKjuDrK6GSBeDqwHaE7?w=295&h=197&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://www.arch2o.com/wp-content/uploads/2016/05/Arch2O-10-extraordinary-concert-hall-designs-1.jpg'
                ]
            },
            'comedy-show': {
                'comedy-stage': [
                    'https://th.bing.com/th/id/OIP.9l-LM6WdLcyxzYhMVV7pjAHaFN?w=241&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.fawjStpEiWbZMFEK-akY4AHaE7?w=253&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.Y3k9S3xXZtbSbMqtDJQKnAHaFV?w=230&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'cultural-fair': {
                'artisan-booths': [
                    'https://th.bing.com/th/id/OIP.AJChKv18zDt3B8bfZqYBwQHaHa?w=191&h=191&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.KrLr74tHwFKNk0vON_enfgHaJ3?w=140&h=186&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.6Ib3ceb8MD6z2bI8sJGA0wHaHa?w=190&h=190&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'cultural-displays': [
                    'https://th.bing.com/th/id/OIP.zAorHSStONzLOkcGJuKM4gHaFj?w=251&h=188&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.fc8DwdGX1DozSTbfF_dmXwHaFB?w=278&h=188&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.fc8DwdGX1DozSTbfF_dmXwHaFB?w=278&h=188&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'wedding': {
                'bridal-photography': [
                    'https://th.bing.com/th/id/OIP.FaiNemHexEFGoZPyeJ7BIQHaJQ?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.eVkyEiWFQcfYl6aYQobnmQHaHa?w=208&h=208&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.J1eNpy90VcnydePVW6dLLAHaLG?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'couple-photography': [
                    'https://th.bing.com/th/id/OIP.sHjHAKufcrINdQirP6w3wgHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.E3eT4E7soy5ZiayQfBOoxwHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.ubjKJs0GjKJncV4D-zTZSgHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'family-photography': [
                    'https://th.bing.com/th/id/OIP.z0mvlkLv6IvBC5qzqJXNOgHaE8?w=257&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.S9qu_FIQt3m13zYddk7ywQHaE8?w=298&h=199&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.nlQUAvYH7go2lCRR6GOlMQHaF7?w=245&h=196&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'candid-photography': [
                    'https://th.bing.com/th/id/OIP.K2rScqMWifdBPh_RBB4QmgHaE8?w=247&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.4x1kg6GXBv2Mq6ZpWFYBAwHaFO?w=237&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.FkMbHCVtkvASwuViBsst8gHaE8?w=270&h=185&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'reception-photography': [
                    'https://th.bing.com/th/id/OIP.xS7dqL3UxmZh8eJN3TbJdgHaE7?w=279&h=186&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.f7hC0UVv_I_AMsVaTEh4ngHaEf?w=308&h=186&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.aMzT_83VvM0XLfegeUj7vwHaE8?w=299&h=199&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'mehendi-photography': [
                    'https://th.bing.com/th/id/OIP.vQOMGuKaLImULupnSTZiGAHaJO?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.vQOMGuKaLImULupnSTZiGAHaJO?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.Wf1aadW5K7JqO88xuU5roQHaJN?w=208&h=258&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'traditional-portraits': [
                    'https://th.bing.com/th/id/OIP.1oyu-c4mFnVfXh5J2EU2mgHaE8?w=294&h=196&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.0-vnqUsdIaynEdQiXjMEeAHaFW?w=273&h=196&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.MXD5JcYxNwxLsTOKgo2wPQHaE8?w=273&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'wedding-album-design': [
                    'https://th.bing.com/th/id/OIP.TYBqcABt6__FNnN_hrqH4AHaF7?w=216&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.tGbfeQeSdRyH7-h56tanrwHaE8?w=258&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.RH0gwOfo1YEGUeYWOt56lAHaFH?w=235&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'mandap-decoration': [
                    'https://th.bing.com/th/id/OIP.bmD21QvgXpnrfK4rW-9BRwHaF9?w=203&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.vw6CjJCRAFv4fFY23hMPaAHaGD?w=224&h=183&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.FZw9CzqGZ5XW3SG4qJE4XAHaDt?w=310&h=175&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'floral-decoration': [
                    'https://th.bing.com/th/id/OIP.1nGcva-I7SWCgMw0Za4x6AHaJM?w=208&h=259&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://cdn0.weddingwire.in/articles/images/7/3/8/2/img_12837/wedding-flower-decoration-lin-and-jirsa-photography-seal-it-with-a-stunning-canopy-style-ceiling.jpg',
                    'https://wedjoin.com/wp-content/uploads/2020/01/decorate-wedding-mandap-flowers-beautiful-flower-decoration-ideas-wedding-day-1.jpg'
                ],
                'wedding-cake': [
                    'https://th.bing.com/th/id/OIP.p7hmBzSLjjTFFWifFrM9TQHaJQ?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.bDxP8Ds3xo2hLl1yBZ7R2gHaJ4?w=208&h=278&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.EouS3ggEgR1e9FCj8kfeCAHaLQ?w=202&h=308&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'birthday': {
                'balloon-decoration': [
                    'https://th.bing.com/th/id/OIP.CI7B_8LMRKW_F5f3CR_lfQHaIB?w=182&h=197&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.Js8nhnJArIVIQ9kOl3NTqQAAAA?w=164&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP._9sWV1AilU94XwEtbPmawgHaHa?w=164&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'theme-decoration': [
                    'https://th.bing.com/th/id/OIP.sL8dNt5lfYZ_43e3VVoJMgHaHa?w=199&h=200&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://i.pinimg.com/736x/43/2b/d7/432bd71bb58591b9e0c9fdb3f887d61b.jpg',
                    'https://m.media-amazon.com/images/I/81GFzZZ57rL._AC_SL1500_.jpg'
                ],
                'event-photography': [
                    'https://th.bing.com/th/id/OIP.QzgQEAzqNzLma0Eoggcw0QHaE8?w=273&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.MUmKuDvJiLFgvamXhA6mfgHaE8?w=273&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.MUmKuDvJiLFgvamXhA6mfgHaE8?w=273&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'candid-photography': [
                    'https://th.bing.com/th/id/OIP.Y_6OaWJieoABEB36wWY8pQHaE8?w=290&h=193&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://bangalorephotographers.in/images/gallery/Photographers-for-Birthday-party.jpg',
                    'https://bangalorephotographers.in/blog/wp-content/uploads/2022/08/Birthday-Photography-Package.jpg'
                ],
                'birthday-cake': [
                    'https://th.bing.com/th/id/OIP._aIeu_633QanVAe9pgdaIgHaMA?w=208&h=314&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.ocSBAq0QxX_nL-aSn3Q1QQHaJQ?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.J96rcY0GJUH7bg6UpMcmNQHaHH?w=208&h=201&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'engagement': {
                'event-photography': [
                    'https://th.bing.com/th/id/OIP.2c-3PKrxxkhDt--_ek18jAHaE8?w=228&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.l7CjDQdLzk8LpkPhvVQNhQHaE6?w=230&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.oDDtLOdPnMiROyNAznaChgHaE8?w=233&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'candid-photography': [
                    'https://th.bing.com/th/id/OIP.M1R3kltQWqIJCdna2Rv_WwHaJ4?w=208&h=277&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.qffPfPf6povZlj5vR1BxMgHaLd?w=201&h=310&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.b7E_kEJxRyaG_L2iSR6pUwHaHa?w=208&h=208&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'event-decoration': [
                    'https://th.bing.com/th/id/OIP.rS01fjCy21bShS1xMNqjxQHaIB?w=146&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.rS01fjCy21bShS1xMNqjxQHaIB?w=146&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.b_dbI5R-EGANciuPQd0YxwHaHa?w=121&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'floral-arrangements': [
                    'https://tse2.mm.bing.net/th/id/OIP.mIUSjhFQ_AbzlboDXKP1WQHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3',
                    'https://images.squarespace-cdn.com/content/v1/5be9a698697a98a5f9beacbd/1691756710228-EKH8ZNYM2546JRTIN5Y3/Photo+Nov+16+2022%2C+6+53+47+PM-min.jpg?format=1500w',
                    'https://tse2.mm.bing.net/th/id/OIP.wHW7Tcmk4UwecgB4ORoH2wHaFj?cb=12&w=1000&h=750&rs=1&pid=ImgDetMain&o=7&rm=3'
                ]
            },
            'anniversary': {
                'anniversary-photography': [
                    'https://th.bing.com/th/id/OIP.d-vS6upR15vcJpPM6uPf2wHaEG?w=298&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.e2OeXk7CNYSe_vXKoPT97wHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.Wx9pyBZSE07kC5YoKwiTCwHaLH?w=204&h=306&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'anniversary-cake': [
                    'https://th.bing.com/th/id/OIP.IZDxOnro839_Wq4qu2fO8wHaHa?w=204&h=204&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.nceVugWMB0yGjI8z4HlA6AHaHa?w=204&h=204&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.iuu4Olfh7sTtiGc61f2ggAHaHa?w=204&h=204&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'baby-shower': {
                'baby-themed-decoration': [
                    'https://th.bing.com/th/id/OIP.YcXXjcJhsx7ktgirRCTy2gAAAA?w=146&h=194&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.NaRBnfhrZqqUbktNDlM-zgHaHa?w=185&h=185&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.l4cNtkjTBdUARb654yP6sAHaHa?w=185&h=185&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'baby-shower-cake': [
                    'https://th.bing.com/th/id/OIP.lk65PA3UysewSjvF-mSVSAAAAA?w=208&h=347&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.kuXnWlBWGvj4XLCvBcUmbQHaHa?w=208&h=208&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.m1rx4OWotivvDi1q5x6v2QAAAA?w=208&h=314&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'pre-wedding-bash': {
                'pre-wedding-photography': [
                    'https://th.bing.com/th/id/OIP.zqgirXXCp75yPDLBYzwJUAHaE-?w=292&h=195&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.uPJVeOS_LT2WI_IlDhlg6wHaE7?w=293&h=195&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.uPJVeOS_LT2WI_IlDhlg6wHaE7?w=293&h=195&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'pre-wedding-decoration': [
                    'https://saidecorationevents.in/wp-content/uploads/2023/04/IMG-20210915-WA0060-684x1024.jpg',
                    'https://saidecorationevents.in/wp-content/uploads/2023/05/IMG-20210915-WA0057.jpg',
                    'https://images.shaadisaga.com/shaadisaga_production/photos/pictures/000/927/783/new_large/smiti_mittal.jpg?1561013889'
                ]
            },
            'gender-reveal-party': {
                'gender-reveal-setup': [
                    'https://th.bing.com/th/id/OIP.eFX9ulSOxyS6lw1oPJQHsgHaGE?w=208&h=171&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.QKwsVRY53eTNdJhWlNimHwHaM9?w=188&h=330&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.IcNw8A3JzXbijhws7h0RcwHaFj?w=208&h=156&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'reveal-photography': [
                    'https://th.bing.com/th/id/OIP.U4zI6wEMofXbhE2l3glxWQHaLG?w=204&h=305&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.hjmMCtiUYbbDkzTC3fpR0wHaFS?w=208&h=149&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.gzWy5yaLq-QFMQyv7d-W6QHaJQ?w=208&h=260&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'diwali-celebration': {
                'diya-decoration': [
                    'https://th.bing.com/th/id/OIF.yvRMceM4HAxLcLPxa7JIaQ?w=304&h=182&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.8sHk1DByD4-6IafTCq5NuwHaJ4?w=130&h=150&c=6&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.8sHk1DByD4-6IafTCq5NuwHaJ4?w=130&h=150&c=6&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'festive-lighting': [
                    'https://th.bing.com/th/id/OIP.m3n0F2RhuJ5nE6vWYcWwCAHaEA?w=295&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.FpmzhhzOF9zA-p0Nj-n-aQHaE8?w=324&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.KxcbG7D1SpKRtQOvJt6W-gHaE8?w=288&h=192&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'flower-decoration': [
                    'https://th.bing.com/th/id/OIP.hcuzHRCNlgmf0OCBzmaGfAHaEK?w=278&h=150&c=6&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.sawsGbmdmw-BL-bEKMfeIgHaGF?w=193&h=150&c=6&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.tHNW_4sGT3e-UnMgd2RN6AHaFc?w=204&h=150&c=6&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ],
                'fireworks-display': [
                    'https://th.bing.com/th/id/OIF.HmKA4tbld2Kp73YJhTqnuQ?w=319&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIF.HmKA4tbld2Kp73YJhTqnuQ?w=319&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.GWCpuSFaysUUbeZpQH2zSQHaE7?w=306&h=187&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'durga-puja': {
                'pandal-design': [
                    'https://th.bing.com/th/id/OIP.158GBTXklLmyKIhdFidgmwHaFa?w=244&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.kP3aa4g6uwA_cPu0gWMTLQHaFf?w=240&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.YV3NlXNI5ecouy6pDhQ9YAHaDt?w=257&h=150&c=6&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'easter-celebration': {
                'church-decoration': [
                    'https://th.bing.com/th/id/OIP.QQF267_kPEmCHDb_iY7sMgHaKD?w=208&h=283&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.nEm_ZqCnTA7ka7sfEZ6EzgHaJ4?w=208&h=277&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.GFzwPtcnWAGIY4MBYaD-OAHaJ4?w=208&h=278&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'eid-al-fitr': {
                'islamic-decoration': [
                    'https://th.bing.com/th/id/OIP.-xYBbUy6AZdttaHBvsv7gQHaHa?w=178&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.4HDuM5kLYLii8DPRAJb0lwHaE2?w=282&h=185&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.rHfjAd9sUKmkS8ZovmwDmwHaIK?w=186&h=205&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'fashion-show': {
                'runway-setup': [
                    'https://th.bing.com/th/id/OIP.vfZgtAM-KddIFNp7ChQMMgHaHa?w=181&h=181&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.uAc8IHKWuGBAkXxjflzalgHaEJ?w=288&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://mir-s3-cdn-cf.behance.net/project_modules/1400/222afd109533383.5fd64c3f7e913.jpg'
                ]
            },
            'ganesh-chaturthi': {
                'pandal-decoration': [
                    'https://th.bing.com/th/id/OIP.h8oEFFiqJobP7Wn-CpsrnQHaE8?w=285&h=190&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.80u4QTGCTM63GrGVGgs80gHaE8?w=276&h=184&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.TZOp436fQd5FG9eT_yFh2gHaE8?w=300&h=200&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            },
            'house-party': {
                'home-decoration': [
                    'https://th.bing.com/th/id/OIP.xhzkHRUTZg4DjFjfWvHXjAHaEK?w=308&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.7QsRPfWhSybnZjTyp9K6OwHaEK?w=313&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://www.mydomaine.com/thmb/zoxJOux0wQU32ET0pdnmE0OQtDU=/3865x0/filters:no_upscale():strip_icc()/nothing-beats-a-good-house-party-614238768-588f42213df78caebcdcd6cc.jpg'
                ]
            },
            'janmashtami': {
                'krishna-costumes': [
                    'https://th.bing.com/th/id/OIP.B3jUujMm01WCH8Bo-yPXDQHaHa?w=178&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.6HKwJcIBBEpQylms4NPMuwHaHa?w=182&h=183&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
                    'https://th.bing.com/th/id/OIP.9Aoet_qMlF0hYNfEnts2IAHaHa?w=209&h=209&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
                ]
            }
        }
        
        
        # Populate images
        for event_name, requirements in images_data.items():
            for requirement_name, image_urls in requirements.items():
                for i, image_url in enumerate(image_urls, 1):
                    EventRequirementImages.objects.create(
                        event_name=event_name,
                        requirement_name=requirement_name,
                        image_number=i,
                        image_url=image_url
                    )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully populated {EventRequirementImages.objects.count()} requirement images')
        )