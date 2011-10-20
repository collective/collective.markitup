# -*- coding: utf-8 -*-
from setuptools import setup, find_packages
import os

version = open(os.path.join("collective", "markitup", "version.txt")).read().strip()

setup(
	name='collective.markitup',
	version=version,
	description="collective.markitup integrates MarkItUp with Plone",
	long_description=open("README.txt").read() + "\n" + open("CHANGES.txt").read(),
	# Get more strings from http://www.python.org/pypi?%3Aaction=list_classifiers
	classifiers=[
		"Framework :: Plone",
		"Programming Language :: Python",
		"Programming Language :: JavaScript",
		"Topic :: Software Development :: Libraries :: Python Modules",
		"Topic :: Text Processing :: Markup",
	 ],
	keywords='web zope plone editor',
	author='Michael A. Smith',
	author_email='michael@smith-li.com',
	url='http://dev.plone.org/collective/browser/collective.markitup',
	license='MIT',
	packages=find_packages(exclude=['ez_setup']),
	namespace_packages=['collective'],
	include_package_data=True,
	zip_safe=False,
	install_requires=[
		'setuptools',
		'collective.plonefinder',
		'collective.quickupload',
		'plone.app.jquerytools >= 1.2',
	],
	entry_points="""
	# -*- Entry points: -*-
	[z3c.autoinclude.plugin]
	target = plone
	""",
)
