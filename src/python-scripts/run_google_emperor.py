from module.googleemperor.repository import Repository
import sys

args = sys.argv

repository = Repository()
repository.routineCrawle("{0}".format(args[1]))
