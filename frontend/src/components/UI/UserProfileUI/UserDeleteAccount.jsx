import { LucideFileWarning } from "lucide-react";

function DeleteAccountSection() {
  return (
    <section className="border border-red-200 rounded-xl bg-red-50/30 overflow-hidden">
      
      <div className="p-6">

        <div className="flex items-start gap-4">

          <div className="size-10 flex items-center justify-center rounded-lg bg-red-100 text-red-600 shrink-0">
            <LucideFileWarning color="#E02424" size={28} />
          </div>

          <div className="flex flex-col gap-4 flex-1">

            <div>
              <h2 className="text-lg font-bold text-red-700">
                Delete Account
              </h2>

              <p className="text-sm text-red-600/80">
                Once you delete your account, there is no going back.
              </p>
            </div>

            <button className="px-8 py-3 bg-red-600 max-w-64 m-auto text-white text-sm font-bold rounded-lg hover:bg-red-700 shadow-md shadow-red-500/20 transition-all">
              Delete My Account
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default DeleteAccountSection;