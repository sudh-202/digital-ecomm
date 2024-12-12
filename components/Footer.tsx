import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Digital Store</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Your one-stop destination for premium digital products and educational resources.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Products', 'About Us', 'Contact', 'Blog'].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {[
                'Digital Products',
                'Educational Content',
                'Software Tools',
                'Templates',
                'Resources'
              ].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-1" />
                <span className="text-gray-600 dark:text-gray-300">
                  123 Digital Avenue,<br />
                  Silicon Valley, CA 94025
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">support@digitalstore.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t dark:border-gray-800">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              © {new Date().getFullYear()} Digital Store. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                href="#" 
                className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href="#" 
                className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
